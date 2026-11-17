import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, verifyAuthToken } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

function getSlotId(date: string, time: string): string {
  const normalizedTime = time.trim().replace(/[:\s]+/g, '-').toUpperCase();
  return `${date.trim()}_${normalizedTime}`;
}

interface RescheduleRequestBody {
  bookingId: string;
  action: 'accept' | 'decline';
}

/**
 * Secure server-side appointment reschedule endpoint.
 *
 * Atomically:
 * 1. Verifies customer identity and booking ownership (or admin privileges).
 * 2. On 'accept':
 *    - Validates suggested new date and time.
 *    - Verifies the new slot is available in both 'bookings' and 'slots'.
 *    - Releases the old slot in 'slots' if it belonged to this booking.
 *    - Reserves the new slot as 'booked'.
 *    - Updates the booking date and time while preserving all payment metadata and history.
 * 3. On 'decline':
 *    - Marks booking as cancelled.
 *    - Releases old slot in 'slots'.
 *    - Preserves payment record and history.
 */
export async function POST(req: NextRequest) {
  // 1. Authenticate user
  let authUser;
  try {
    authUser = await verifyAuthToken(req);
  } catch (authError: any) {
    return NextResponse.json(
      { error: authError.message || 'Authentication required.', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  // 2. Parse request body
  let body: RescheduleRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body.', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }

  const { bookingId, action } = body;
  if (!bookingId || !action || !['accept', 'decline'].includes(action)) {
    return NextResponse.json(
      { error: 'bookingId and action ("accept" or "decline") are required.', code: 'INVALID_FIELDS' },
      { status: 400 }
    );
  }

  const db = getAdminFirestore();

  // Determine if caller is an admin
  const userEmail = authUser.email?.toLowerCase() || '';
  const usersDoc = await db.collection('users').doc(authUser.uid).get();
  const isAdminRole = usersDoc.exists && usersDoc.data()?.role === 'admin';
  const adminEmailDoc = userEmail
    ? await db.collection('authorized_admins').doc(userEmail).get()
    : null;
  const isAuthorizedAdmin = adminEmailDoc?.exists ?? false;
  const isHardcodedAdmin = userEmail === 'osiamijnr@gmail.com';
  const isAdmin = isAdminRole || isAuthorizedAdmin || isHardcodedAdmin;

  try {
    const result = await db.runTransaction(async (transaction) => {
      const bookingRef = db.collection('bookings').doc(bookingId);
      const bookingSnap = await transaction.get(bookingRef);

      if (!bookingSnap.exists) {
        throw Object.assign(new Error('Booking not found.'), {
          code: 'NOT_FOUND',
          httpStatus: 404,
        });
      }

      const bookingData = bookingSnap.data()!;

      // Enforce ownership: only the customer who booked or an admin can act
      if (bookingData.userId !== authUser.uid && !isAdmin) {
        throw Object.assign(
          new Error('You do not have permission to modify this appointment.'),
          { code: 'FORBIDDEN', httpStatus: 403 }
        );
      }

      const oldDate = bookingData.date;
      const oldTime = bookingData.time;
      const oldSlotId = oldDate && oldTime ? getSlotId(oldDate, oldTime) : null;
      const oldSlotRef = oldSlotId ? db.collection('slots').doc(oldSlotId) : null;

      if (action === 'accept') {
        const newDate = bookingData.rescheduleSuggestedDate;
        const newTime = bookingData.rescheduleSuggestedTime;

        if (!newDate || !newTime) {
          throw Object.assign(
            new Error('This booking does not have an active suggested reschedule date and time.'),
            { code: 'NO_SUGGESTED_TIME', httpStatus: 400 }
          );
        }

        const newSlotId = getSlotId(newDate, newTime);
        const newSlotRef = db.collection('slots').doc(newSlotId);

        // Firestore Transactions require all READS before any WRITES:
        const [oldSlotSnap, newSlotSnap, existingBookingsSnap] = await Promise.all([
          oldSlotRef ? transaction.get(oldSlotRef) : Promise.resolve(null),
          transaction.get(newSlotRef),
          transaction.get(
            db.collection('bookings').where('date', '==', newDate).where('time', '==', newTime)
          ),
        ]);

        // Check if new slot is taken by another active booking
        const conflictBooking = existingBookingsSnap.docs.find(
          (doc) => doc.id !== bookingId && doc.data().status && doc.data().status !== 'cancelled'
        );
        if (conflictBooking) {
          throw Object.assign(
            new Error('The suggested slot is no longer available. Please contact the salon to choose another time.'),
            { code: 'SLOT_UNAVAILABLE', httpStatus: 409 }
          );
        }

        // Check if new slot is taken in 'slots' collection
        if (newSlotSnap.exists) {
          const nData = newSlotSnap.data()!;
          const now = Date.now();
          const isBooked = nData.status === 'booked' && nData.userId !== bookingData.userId;
          const isReservedByOther =
            nData.status === 'reserved' &&
            (nData.expiresAt || 0) > now &&
            nData.userId !== bookingData.userId;

          if (isBooked || isReservedByOther) {
            throw Object.assign(
              new Error('The suggested slot is currently reserved or booked by another customer.'),
              { code: 'SLOT_UNAVAILABLE', httpStatus: 409 }
            );
          }
        }

        // --- PERFORM WRITES ---

        // 1. Release old slot if it belongs to this booking
        if (oldSlotSnap && oldSlotSnap.exists) {
          const oData = oldSlotSnap.data()!;
          const belongsToThisBooking =
            oData.userId === bookingData.userId ||
            (bookingData.paymentReference && oData.paystackReference === bookingData.paymentReference);

          if (belongsToThisBooking) {
            transaction.delete(oldSlotRef!);
          }
        }

        // 2. Secure the new slot
        transaction.set(newSlotRef, {
          slotId: newSlotId,
          date: newDate,
          time: newTime,
          serviceId: bookingData.serviceId || 'salon-service',
          serviceName: bookingData.serviceName || 'Salon Service',
          userId: bookingData.userId,
          userEmail: bookingData.userEmail || '',
          userName: bookingData.userName || '',
          status: 'booked',
          bookedAt: new Date().toISOString(),
          paystackReference: bookingData.paymentReference || null,
          updatedAt: new Date().toISOString(),
        });

        // 3. Update booking details while PRESERVING all payment fields
        transaction.update(bookingRef, {
          date: newDate,
          time: newTime,
          status: 'pending', // Reverts to pending review so admin can confirm
          rescheduleAccepted: true,
          rescheduleDeclined: false,
          rescheduledAt: new Date().toISOString(),
        });

        return {
          action: 'accept',
          newDate,
          newTime,
          message: 'Appointment successfully rescheduled to the new time and slot secured.',
        };
      } else {
        // action === 'decline'
        const oldSlotSnap = oldSlotRef ? await transaction.get(oldSlotRef) : null;

        // Release old slot if it belongs to this booking
        if (oldSlotSnap && oldSlotSnap.exists) {
          const oData = oldSlotSnap.data()!;
          const belongsToThisBooking =
            oData.userId === bookingData.userId ||
            (bookingData.paymentReference && oData.paystackReference === bookingData.paymentReference);

          if (belongsToThisBooking) {
            transaction.delete(oldSlotRef!);
          }
        }

        // Mark booking as cancelled while preserving payment information
        transaction.update(bookingRef, {
          status: 'cancelled',
          rescheduleDeclined: true,
          rescheduleAccepted: false,
          rescheduledAt: new Date().toISOString(),
        });

        return {
          action: 'decline',
          message: 'Reschedule request declined and appointment cancelled.',
        };
      }
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    if (err.httpStatus) {
      return NextResponse.json(
        { error: err.message, code: err.code || 'RESCHEDULE_ERROR' },
        { status: err.httpStatus }
      );
    }
    console.error('Error in reschedule transaction:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process reschedule.', code: 'TRANSACTION_ERROR' },
      { status: 500 }
    );
  }
}

