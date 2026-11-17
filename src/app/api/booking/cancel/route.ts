import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, verifyAuthToken } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * Generates a deterministic slot document ID.
 * Must match the logic in reserve-slot/route.ts.
 */
function getSlotId(date: string, time: string): string {
  const normalizedTime = time.trim().replace(/[:\s]+/g, '-').toUpperCase();
  return `${date.trim()}_${normalizedTime}`;
}

/**
 * Server-side booking cancellation endpoint.
 *
 * Atomically:
 * 1. Sets the booking status to "cancelled".
 * 2. Releases the associated slot (only if it belongs to this booking).
 *
 * Accepts: POST { bookingId }
 * Auth: Firebase ID token (admin only for now — matches existing admin flow).
 */
export async function POST(req: NextRequest) {
  // 1. Authenticate — only admins may cancel bookings
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
  let body: { bookingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body.', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }

  const { bookingId } = body;
  if (!bookingId || typeof bookingId !== 'string') {
    return NextResponse.json(
      { error: 'Missing required field: bookingId.', code: 'MISSING_FIELDS' },
      { status: 400 }
    );
  }

  const db = getAdminFirestore();

  // 3. Verify admin status — check authorized_admins or hardcoded email
  const userEmail = authUser.email?.toLowerCase() || '';
  const usersDoc = await db.collection('users').doc(authUser.uid).get();
  const isAdminRole = usersDoc.exists && usersDoc.data()?.role === 'admin';
  const adminEmailDoc = userEmail
    ? await db.collection('authorized_admins').doc(userEmail).get()
    : null;
  const isAuthorizedAdmin = adminEmailDoc?.exists ?? false;
  const isHardcodedAdmin = userEmail === 'osiamijnr@gmail.com';

  if (!isAdminRole && !isAuthorizedAdmin && !isHardcodedAdmin) {
    return NextResponse.json(
      { error: 'Only admins can cancel bookings through this endpoint.', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  // 4. Atomic transaction: cancel booking + release slot
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

      // Already cancelled — idempotent
      if (bookingData.status === 'cancelled') {
        return { alreadyCancelled: true, slotReleased: false };
      }

      // Cancel the booking
      const updates: Record<string, any> = {
        status: 'cancelled',
        rescheduleAccepted: false,
        rescheduleDeclined: false,
      };
      transaction.update(bookingRef, updates);

      // Release the associated slot if it belongs to this booking/user
      let slotReleased = false;
      const date = bookingData.date;
      const time = bookingData.time;

      if (date && time) {
        const slotId = getSlotId(date, time);
        const slotRef = db.collection('slots').doc(slotId);
        const slotSnap = await transaction.get(slotRef);

        if (slotSnap.exists) {
          const slotData = slotSnap.data()!;
          // Only release the slot if it belongs to the same user/booking.
          // Check by userId match or paymentReference match.
          const slotBelongsToBooking =
            slotData.userId === bookingData.userId ||
            (bookingData.paymentReference &&
              slotData.paystackReference === bookingData.paymentReference);

          if (slotBelongsToBooking) {
            transaction.delete(slotRef);
            slotReleased = true;
          }
        }
      }

      return { alreadyCancelled: false, slotReleased };
    });

    return NextResponse.json({
      success: true,
      alreadyCancelled: result.alreadyCancelled,
      slotReleased: result.slotReleased,
      message: result.alreadyCancelled
        ? 'Booking was already cancelled.'
        : result.slotReleased
          ? 'Booking cancelled and appointment slot released.'
          : 'Booking cancelled.',
    });
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.httpStatus || 404 }
      );
    }

    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel booking.', code: 'TRANSACTION_ERROR' },
      { status: 500 }
    );
  }
}

