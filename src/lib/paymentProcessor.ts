import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { sendEmail, FROM_BOOKINGS, FROM_SALON, ADMIN_EMAIL, APP_URL } from '@/lib/email';
import { getServiceFromCatalogue, calculateCommitmentFee } from '@/lib/servicesCatalogue';

export interface PaystackVerifyResult {
  success: boolean;
  alreadyProcessed?: boolean;
  bookingId?: string;
  bookingData?: any;
  latePaymentConflict?: boolean;
  message?: string;
  error?: string;
}

/**
 * Shared atomic payment processor for Paystack transactions.
 * Used identically by both client verification (/api/paystack/verify)
 * and server webhook (/api/webhooks/paystack) to guarantee idempotency.
 */
export async function processPaystackTransaction(
  reference: string,
  verifiedData?: any
): Promise<PaystackVerifyResult> {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecretKey) {
    return { success: false, error: 'PAYSTACK_SECRET_KEY is not configured on server.' };
  }

  // 1. Fetch verification directly from Paystack API if not already provided
  let paystackData = verifiedData;
  if (!paystackData) {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const json = await response.json();
      if (!response.ok || !json.status || !json.data) {
        return {
          success: false,
          error: json.message || 'Failed to verify transaction with Paystack.',
        };
      }
      paystackData = json.data;
    } catch (fetchErr: any) {
      console.error('Paystack verification network error:', fetchErr);
      return {
        success: false,
        error: fetchErr.message || 'Unable to connect to Paystack verification API.',
      };
    }
  }

  // 2. Validate transaction state
  if (paystackData.status !== 'success') {
    return {
      success: false,
      error: `Transaction status is "${paystackData.status}", not "success".`,
    };
  }

  if (paystackData.currency !== 'NGN') {
    return {
      success: false,
      error: `Invalid currency "${paystackData.currency}". Expected "NGN".`,
    };
  }

  // Verify transaction reference
  if (paystackData.reference && paystackData.reference !== reference) {
    return {
      success: false,
      error: `Transaction reference mismatch: expected "${reference}", received "${paystackData.reference}".`,
    };
  }

  const metadata = paystackData.metadata || {};
  const serviceId = metadata.serviceId;
  if (!serviceId) {
    return {
      success: false,
      error: 'Missing required serviceId in transaction metadata.',
    };
  }

  // Look up service in official server-side catalogue
  const catalogueService = getServiceFromCatalogue(serviceId);
  if (!catalogueService) {
    return {
      success: false,
      error: `Unrecognized service "${serviceId}" in transaction metadata.`,
    };
  }

  // Calculate trusted commitment fee on server (default 30%)
  const percentageEnv = parseInt(process.env.COMMITMENT_FEE_PERCENTAGE || '30', 10);
  const configuredPercentage = isNaN(percentageEnv) ? 30 : percentageEnv;
  const feeCalc = calculateCommitmentFee(catalogueService.price, configuredPercentage);

  if (!feeCalc.isPayable) {
    return {
      success: false,
      error: feeCalc.reason || `Service "${catalogueService.name}" is not eligible for online payment.`,
    };
  }

  // Strict amount verification: actual Paystack amount in kobo MUST exactly match server calculation
  if (typeof paystackData.amount !== 'number' || paystackData.amount !== feeCalc.commitmentFeeKobo) {
    return {
      success: false,
      error: `Strict amount verification failed: paid ${paystackData.amount} kobo, expected ${feeCalc.commitmentFeeKobo} kobo for "${catalogueService.name}".`,
    };
  }

  // Verify metadata integrity against server calculation
  if (
    typeof metadata.commitmentFeeKobo === 'number' &&
    metadata.commitmentFeeKobo !== feeCalc.commitmentFeeKobo
  ) {
    return {
      success: false,
      error: `Metadata tamper detected: commitmentFeeKobo (${metadata.commitmentFeeKobo}) differs from expected (${feeCalc.commitmentFeeKobo}).`,
    };
  }

  const slotId = metadata.slotId;
  const db = getAdminFirestore();
  const paymentRef = db.collection('payments').doc(reference);

  // 3. Fast-path idempotency check: already processed
  const existingPaymentSnap = await paymentRef.get();
  if (existingPaymentSnap.exists && existingPaymentSnap.data()?.status === 'completed') {
    const pData = existingPaymentSnap.data();
    return {
      success: true,
      alreadyProcessed: true,
      bookingId: pData?.bookingId,
      latePaymentConflict: pData?.latePaymentConflict || false,
      message: 'Transaction has already been verified and processed.',
    };
  }

  // 4. Atomic Firestore transaction: record payment, update slot, create booking
  let createdBookingId = '';
  let finalBookingData: any = null;
  let hasLateConflict = false;

  try {
    const txResult = await db.runTransaction(async (transaction) => {
      // Re-verify payment doc inside transaction to prevent race conditions
      const txPaymentSnap = await transaction.get(paymentRef);
      if (txPaymentSnap.exists && txPaymentSnap.data()?.status === 'completed') {
        const p = txPaymentSnap.data();
        return {
          alreadyProcessed: true,
          bookingId: p?.bookingId,
          latePaymentConflict: p?.latePaymentConflict || false,
        };
      }

      let lateConflict = false;

      // Inspect associated slot if slotId was provided
      if (slotId) {
        const slotRef = db.collection('slots').doc(slotId);
        const slotSnap = await transaction.get(slotRef);

        if (slotSnap.exists) {
          const sData = slotSnap.data();
          const now = Date.now();
          const isExpired = (sData?.expiresAt || 0) <= now;
          const isBooked = sData?.status === 'booked';
          const isAnotherUser = sData?.userId && sData?.userId !== metadata.userId;

          // Check whether another customer holds an active, unexpired reservation
          const isReservedByOther =
            sData?.status === 'reserved' &&
            (sData?.expiresAt || 0) > now &&
            isAnotherUser;

          // Late payment handling:
          // If the slot was already booked by another user, or another customer
          // holds a still-active reservation, flag as late payment conflict
          // instead of overwriting their slot. The paying customer's booking and
          // payment record are still created so their payment is never lost.
          if ((isBooked && isAnotherUser) || isReservedByOther) {
            lateConflict = true;
          } else {
            // Lock slot permanently
            transaction.update(slotRef, {
              status: 'booked',
              bookedAt: new Date().toISOString(),
              paystackReference: reference,
            });
          }
        }
      }

      // Create new booking document in 'bookings' collection using strictly verified server amounts
      const bookingRef = db.collection('bookings').doc();
      const bookingPayload = {
        userId: metadata.userId || paystackData.customer?.id || 'anonymous',
        userName: metadata.userName || 'Valued Client',
        userEmail: metadata.userEmail || paystackData.customer?.email || 'No Email',
        serviceId: catalogueService.id,
        serviceName: catalogueService.name,
        price: `₦${feeCalc.originalPriceNaira.toLocaleString()}`,
        category: catalogueService.category || metadata.category || 'Salon',
        date: metadata.date || new Date().toISOString().split('T')[0],
        time: metadata.time || '10:00 AM',
        status: 'pending', // Preserves existing admin confirmation workflow
        createdAt: new Date().toISOString(),
        paymentStatus: 'paid_deposit',
        paymentReference: reference,
        depositPaidNaira: feeCalc.commitmentFeeNaira,
        balanceDueNaira: feeCalc.balanceDueNaira,
        commitmentPercentage: feeCalc.percentage,
        paidAmountKobo: paystackData.amount,
        paymentChannel: paystackData.channel || 'card',
        paidAt: paystackData.paid_at || new Date().toISOString(),
        latePaymentConflict: lateConflict,
      };

      transaction.set(bookingRef, bookingPayload);

      // Record payment document
      transaction.set(paymentRef, {
        reference,
        bookingId: bookingRef.id,
        slotId: slotId || null,
        userId: metadata.userId || null,
        customerEmail: paystackData.customer?.email || metadata.userEmail || null,
        amountKobo: paystackData.amount,
        amountNaira: feeCalc.commitmentFeeNaira,
        currency: 'NGN',
        channel: paystackData.channel || 'card',
        status: 'completed',
        latePaymentConflict: lateConflict,
        paidAt: paystackData.paid_at || new Date().toISOString(),
        processedAt: new Date().toISOString(),
        emailSent: false,
      });

      return {
        alreadyProcessed: false,
        bookingId: bookingRef.id,
        bookingPayload,
        latePaymentConflict: lateConflict,
      };
    });

    if (txResult.alreadyProcessed) {
      return {
        success: true,
        alreadyProcessed: true,
        bookingId: txResult.bookingId,
        latePaymentConflict: txResult.latePaymentConflict,
      };
    }

    createdBookingId = txResult.bookingId;
    finalBookingData = txResult.bookingPayload;
    hasLateConflict = txResult.latePaymentConflict;
  } catch (txErr: any) {
    console.error('Firestore transaction failed in processPaystackTransaction:', txErr);
    return {
      success: false,
      error: txErr.message || 'Database transaction error processing payment.',
    };
  }

  // 5. Send Email Notifications (Outside transaction, idempotently dispatched)
  try {
    const customerEmail = finalBookingData?.userEmail;
    const userName = finalBookingData?.userName || 'Valued Client';
    const serviceName = finalBookingData?.serviceName || 'Salon Service';
    const appointmentDate = finalBookingData?.date;
    const appointmentTime = finalBookingData?.time;
    const depositNaira = Number(finalBookingData?.depositPaidNaira || 0).toLocaleString();
    const balanceNaira = Number(finalBookingData?.balanceDueNaira || 0).toLocaleString();

    // 5A. Admin Notification
    const adminSubject = hasLateConflict
      ? `⚠️ URGENT: Paid Booking with Slot Conflict - ${serviceName} (${userName})`
      : `New Paid Booking Request (30% Deposit Paid): ${serviceName} - ${userName}`;

    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #f59e0b;">${hasLateConflict ? '⚠️ Slot Conflict Alert' : 'New Paid Booking Request'}</h1>
        <p>A customer has paid their 30% commitment fee via Paystack.</p>
        
        ${hasLateConflict ? `
          <div style="background-color: #fee2e2; border: 1px solid #ef4444; color: #b91c1c; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <strong>LATE PAYMENT NOTICE:</strong> The customer completed payment after their 10-minute reservation expired, and the original slot was already booked by someone else. Please contact the client immediately to agree on a rescheduled time.
          </div>
        ` : ''}

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 10px;">
          <p style="margin: 5px 0;"><strong>Client:</strong> ${userName} (${customerEmail})</p>
          <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
          <p style="margin: 5px 0;"><strong>Commitment Fee Paid:</strong> ₦${depositNaira}</p>
          <p style="margin: 5px 0;"><strong>Balance Due at Salon:</strong> ₦${balanceNaira}</p>
          <p style="margin: 5px 0;"><strong>Paystack Reference:</strong> ${reference}</p>
        </div>

        <p style="margin-top: 15px;">This appointment is currently <strong>PENDING</strong>. Please log in to the dashboard to confirm or reschedule.</p>
        <p style="margin-top: 20px;"><a href="${APP_URL}" style="color: #f59e0b; font-weight: bold; text-decoration: none;">Open Admin Dashboard</a></p>
      </div>
    `;

    await sendEmail({
      from: FROM_BOOKINGS,
      to: [ADMIN_EMAIL],
      replyTo: customerEmail && customerEmail !== 'No Email' ? customerEmail : undefined,
      subject: adminSubject,
      html: adminHtml,
    });

    // 5B. Customer Confirmation & Receipt Notification
    if (customerEmail && customerEmail.includes('@') && customerEmail !== 'No Email') {
      const customerSubject = `Deposit Received: ${serviceName} Appointment Request — Best Salon`;
      const customerHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #f59e0b; text-transform: uppercase; letter-spacing: -1px;">BEST CREATIVE HUB <span style="color: #6b7280; font-size: 16px;">&bull; Best Salon</span></h1>
          <p style="font-size: 18px;">Hello <strong>${userName}</strong>,</p>
          <p>We have successfully received your <strong>30% commitment deposit</strong> of <strong>₦${depositNaira}</strong> for your upcoming appointment.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; font-size: 16px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Appointment Request Summary</h2>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 5px 0;"><strong>Requested Date:</strong> ${appointmentDate}</p>
            <p style="margin: 5px 0;"><strong>Requested Time:</strong> ${appointmentTime}</p>
            <p style="margin: 5px 0;"><strong>Deposit Paid (30%):</strong> ₦${depositNaira}</p>
            <p style="margin: 5px 0; color: #f59e0b;"><strong>Remaining Balance (70%):</strong> ₦${balanceNaira} (payable upon arrival at salon)</p>
            <p style="margin: 5px 0; font-size: 12px; color: #9ca3af;"><strong>Payment Reference:</strong> ${reference}</p>
          </div>

          <p style="color: #4b5563; font-size: 14px;">Your appointment status is currently <strong>PENDING ADMIN CONFIRMATION</strong>. Our team will review the schedule and send you a formal confirmation email shortly.</p>
          <p style="color: #6b7280; font-size: 13px;">If you have any questions or need to make adjustments, please contact us at +234 806 805 9823 or reply to this email.</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">Best Creative Hub &bull; Best Salon &bull; Block 1, Plot 7, Ogundola layout &bull; Akure</p>
        </div>
      `;

      await sendEmail({
        from: FROM_SALON,
        to: [customerEmail],
        subject: customerSubject,
        html: customerHtml,
      });
    }

    // Mark emailSent: true on the payment document
    await paymentRef.update({ emailSent: true });
  } catch (emailErr) {
    console.error('Email dispatch error after payment processing:', emailErr);
    // Do not fail the transaction if email delivery has a temporary network hiccup
  }

  return {
    success: true,
    alreadyProcessed: false,
    bookingId: createdBookingId,
    bookingData: finalBookingData,
    latePaymentConflict: hasLateConflict,
  };
}

