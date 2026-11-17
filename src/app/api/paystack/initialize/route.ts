import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, verifyAuthToken } from '@/lib/firebaseAdmin';
import { getServiceFromCatalogue, calculateCommitmentFee } from '@/lib/servicesCatalogue';

export const dynamic = 'force-dynamic';

interface InitializeRequestBody {
  slotId: string;
  serviceId?: string;
}

export async function POST(req: NextRequest) {
  // 1. Verify Firebase Auth ID token
  let authUser;
  try {
    authUser = await verifyAuthToken(req);
  } catch (authError: any) {
    return NextResponse.json(
      {
        error: authError.message || 'Authentication required to initialize payment.',
        code: 'UNAUTHORIZED',
      },
      { status: 401 }
    );
  }

  // 2. Validate Paystack secret key configuration
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecretKey) {
    console.error('PAYSTACK_SECRET_KEY is not configured.');
    return NextResponse.json(
      {
        error: 'Payment service is not configured. Please contact support.',
        code: 'PAYMENT_CONFIG_MISSING',
      },
      { status: 503 }
    );
  }

  // 3. Parse and validate request body
  let body: InitializeRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body.', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }

  const { slotId } = body;
  if (!slotId || typeof slotId !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid slotId in request body.', code: 'MISSING_SLOT_ID' },
      { status: 400 }
    );
  }

  // 4. Retrieve and validate the slot reservation from Firestore
  const db = getAdminFirestore();
  const slotRef = db.collection('slots').doc(slotId);
  const slotSnap = await slotRef.get();

  if (!slotSnap.exists) {
    return NextResponse.json(
      {
        error: 'Slot reservation not found. Please select and reserve a slot first.',
        code: 'RESERVATION_NOT_FOUND',
      },
      { status: 404 }
    );
  }

  const slotData = slotSnap.data();
  const now = Date.now();
  const expiresAt = typeof slotData?.expiresAt === 'number' ? slotData.expiresAt : 0;

  // Verify ownership
  if (slotData?.userId !== authUser.uid) {
    return NextResponse.json(
      {
        error: 'Unauthorized: This reservation belongs to another user.',
        code: 'RESERVATION_FORBIDDEN',
      },
      { status: 403 }
    );
  }

  // Verify not already permanently booked
  if (slotData?.status === 'booked') {
    return NextResponse.json(
      {
        error: 'This appointment slot has already been completed and booked.',
        code: 'SLOT_ALREADY_BOOKED',
      },
      { status: 409 }
    );
  }

  // Verify reservation has not expired
  if (expiresAt <= now) {
    return NextResponse.json(
      {
        error: 'Your 10-minute slot reservation has expired. Please select the slot again.',
        code: 'RESERVATION_EXPIRED',
      },
      { status: 410 }
    );
  }

  // 5. Look up trusted service in catalogue & calculate commitment fee
  const serviceId = body.serviceId || slotData?.serviceId;
  const catalogueService = getServiceFromCatalogue(serviceId);

  if (!catalogueService) {
    return NextResponse.json(
      {
        error: `Service "${serviceId}" is not recognized in the official service catalogue.`,
        code: 'INVALID_SERVICE',
      },
      { status: 400 }
    );
  }

  // Calculate fee on server using environment variable percentage (default 30%)
  const percentageEnv = parseInt(process.env.COMMITMENT_FEE_PERCENTAGE || '30', 10);
  const configuredPercentage = isNaN(percentageEnv) ? 30 : percentageEnv;

  const feeCalc = calculateCommitmentFee(catalogueService.price, configuredPercentage);

  if (!feeCalc.isPayable) {
    return NextResponse.json(
      {
        error: feeCalc.reason || 'This service is not available for online commitment payment.',
        code: 'PRICE_ON_REQUEST',
      },
      { status: 400 }
    );
  }

  // 6. Duplicate-Initialization Handling: Reuse existing active checkout if already initialized
  if (
    slotData?.paystackReference &&
    slotData?.paystackAuthUrl &&
    slotData?.commitmentFeeKobo === feeCalc.commitmentFeeKobo &&
    expiresAt > now
  ) {
    return NextResponse.json(
      {
        success: true,
        message: 'Reusing existing active payment checkout for this reservation.',
        data: {
          authorizationUrl: slotData.paystackAuthUrl,
          accessCode: slotData.paystackAccessCode || null,
          reference: slotData.paystackReference,
          pricing: {
            serviceName: catalogueService.name,
            originalPriceNaira: feeCalc.originalPriceNaira,
            commitmentFeeNaira: feeCalc.commitmentFeeNaira,
            balanceDueNaira: feeCalc.balanceDueNaira,
            percentage: feeCalc.percentage,
          },
          reservation: {
            slotId: slotData.slotId,
            date: slotData.date,
            time: slotData.time,
            expiresAt: slotData.expiresAt,
          },
        },
      },
      { status: 200 }
    );
  }

  // 7. Generate a unique payment reference for this attempt
  const sanitizedSlot = slotId.replace(/[^a-zA-Z0-9]/g, '_');
  const reference = `BCH_${sanitizedSlot}_${Date.now()}`;
  const customerEmail = authUser.email || slotData?.userEmail;

  if (!customerEmail || !customerEmail.includes('@')) {
    return NextResponse.json(
      {
        error: 'A valid email address associated with your account is required to process payment.',
        code: 'INVALID_CUSTOMER_EMAIL',
      },
      { status: 400 }
    );
  }

  // 8. Initialize transaction with Paystack API
  const appUrl = process.env.APP_URL || 'https://bestcreativehub.com';
  const callbackUrl = `${appUrl}/salon?booking_status=verifying&reference=${reference}`;

  const paystackPayload = {
    email: customerEmail,
    amount: feeCalc.commitmentFeeKobo, // Paystack requires amount in Kobo
    reference,
    callback_url: callbackUrl,
    metadata: {
      slotId: slotData.slotId,
      userId: authUser.uid,
      userEmail: customerEmail,
      userName: slotData.userName || authUser.token.name || 'Valued Client',
      serviceId: catalogueService.id,
      serviceName: catalogueService.name,
      category: catalogueService.category,
      date: slotData.date,
      time: slotData.time,
      originalPriceNaira: feeCalc.originalPriceNaira,
      commitmentFeeNaira: feeCalc.commitmentFeeNaira,
      balanceDueNaira: feeCalc.balanceDueNaira,
      commitmentFeeKobo: feeCalc.commitmentFeeKobo,
      percentage: feeCalc.percentage,
      custom_fields: [
        {
          display_name: 'Service',
          variable_name: 'service_name',
          value: catalogueService.name,
        },
        {
          display_name: 'Appointment Date',
          variable_name: 'appointment_date',
          value: slotData.date,
        },
        {
          display_name: 'Appointment Time',
          variable_name: 'appointment_time',
          value: slotData.time,
        },
        {
          display_name: 'Commitment Fee (30%)',
          variable_name: 'commitment_fee',
          value: `₦${feeCalc.commitmentFeeNaira.toLocaleString()}`,
        },
        {
          display_name: 'Balance Due at Salon',
          variable_name: 'balance_due',
          value: `₦${feeCalc.balanceDueNaira.toLocaleString()}`,
        },
      ],
    },
  };

  try {
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload),
    });

    const paystackResult = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackResult.status || !paystackResult.data) {
      console.error('Paystack initialization failure:', paystackResult);
      return NextResponse.json(
        {
          error: paystackResult.message || 'Payment provider rejected transaction initialization.',
          code: 'PAYSTACK_ERROR',
        },
        { status: 502 }
      );
    }

    const { authorization_url, access_code } = paystackResult.data;

    // 9. Associate the payment reference and fee metadata with the reservation
    await slotRef.update({
      paystackReference: reference,
      paystackAuthUrl: authorization_url,
      paystackAccessCode: access_code,
      originalPriceNaira: feeCalc.originalPriceNaira,
      commitmentFeeNaira: feeCalc.commitmentFeeNaira,
      balanceDueNaira: feeCalc.balanceDueNaira,
      commitmentFeeKobo: feeCalc.commitmentFeeKobo,
      percentage: feeCalc.percentage,
      paystackInitializedAt: new Date().toISOString(),
    });

    // 10. Return only necessary checkout information to client
    return NextResponse.json(
      {
        success: true,
        message: 'Paystack transaction initialized successfully.',
        data: {
          authorizationUrl: authorization_url,
          accessCode: access_code,
          reference,
          pricing: {
            serviceName: catalogueService.name,
            originalPriceNaira: feeCalc.originalPriceNaira,
            commitmentFeeNaira: feeCalc.commitmentFeeNaira,
            balanceDueNaira: feeCalc.balanceDueNaira,
            percentage: feeCalc.percentage,
          },
          reservation: {
            slotId: slotData.slotId,
            date: slotData.date,
            time: slotData.time,
            expiresAt: slotData.expiresAt,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Network or server error during Paystack initialization:', error);
    return NextResponse.json(
      {
        error: error.message || 'Unable to communicate with payment gateway. Please try again.',
        code: 'PAYSTACK_GATEWAY_ERROR',
      },
      { status: 502 }
    );
  }
}

