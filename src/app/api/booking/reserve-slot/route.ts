import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, verifyAuthToken } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

const TEN_MINUTES_MS = 10 * 60 * 1000;

const VALID_TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM'
];

/**
 * Generates a deterministic slot document ID.
 * Example: date "2026-11-20", time "09:00 AM" -> "2026-11-20_09-00-AM"
 */
export function getSlotId(date: string, time: string): string {
  const normalizedTime = time.trim().replace(/[:\s]+/g, '-').toUpperCase();
  return `${date.trim()}_${normalizedTime}`;
}

interface ReserveSlotBody {
  date: string;
  time: string;
  serviceId: string;
  serviceName: string;
  category?: string;
  price?: string;
  userName?: string;
}

export async function POST(req: NextRequest) {
  // 1. Authenticate customer using Firebase ID token (Never trust client-supplied userId)
  let authUser;
  try {
    authUser = await verifyAuthToken(req);
  } catch (authError: any) {
    return NextResponse.json(
      { 
        error: authError.message || 'Authentication required to reserve an appointment slot.',
        code: 'UNAUTHORIZED'
      },
      { status: 401 }
    );
  }

  // 2. Parse and validate request body
  let body: ReserveSlotBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body.', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }

  const { date, time, serviceId, serviceName, category, price, userName } = body;

  if (!date || !time || !serviceId || !serviceName) {
    return NextResponse.json(
      {
        error: 'Missing required fields: date, time, serviceId, and serviceName must be provided.',
        code: 'MISSING_FIELDS'
      },
      { status: 400 }
    );
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Expected YYYY-MM-DD.', code: 'INVALID_DATE' },
      { status: 400 }
    );
  }

  // Validate time slot against supported schedule
  if (!VALID_TIME_SLOTS.includes(time.trim())) {
    return NextResponse.json(
      {
        error: `Invalid time slot "${time}". Valid slots are: ${VALID_TIME_SLOTS.join(', ')}.`,
        code: 'INVALID_TIME'
      },
      { status: 400 }
    );
  }

  const slotId = getSlotId(date, time);
  const db = getAdminFirestore();
  const slotRef = db.collection('slots').doc(slotId);
  const bookingsQuery = db.collection('bookings')
    .where('date', '==', date)
    .where('time', '==', time);

  try {
    const result = await db.runTransaction(async (transaction) => {
      const now = Date.now();

      // Step A: Check existing bookings for this date and time
      // Active statuses ('pending', 'confirmed', 'completed', 'rescheduled') make the slot occupied.
      // Cancelled bookings are treated as free/unoccupied.
      const bookingsSnap = await transaction.get(bookingsQuery);
      const activeBooking = bookingsSnap.docs.find((doc) => {
        const b = doc.data();
        return b.status && b.status !== 'cancelled';
      });

      if (activeBooking) {
        const activeData = activeBooking.data();
        const err = new Error('This appointment slot has already been booked and is unavailable.');
        (err as any).code = 'SLOT_ALREADY_BOOKED';
        (err as any).status = 409;
        (err as any).details = {
          date,
          time,
          bookingStatus: activeData.status,
        };
        throw err;
      }

      // Step B: Check the deterministic temporary slot document
      const slotSnap = await transaction.get(slotRef);

      if (slotSnap.exists) {
        const slotData = slotSnap.data();
        const expiresAt = typeof slotData?.expiresAt === 'number' ? slotData.expiresAt : 0;
        const isExpired = expiresAt <= now;
        const reservedBy = slotData?.userId;
        const status = slotData?.status;

        // If permanently marked as booked in the slots collection
        if (status === 'booked') {
          const err = new Error('This appointment slot is already booked.');
          (err as any).code = 'SLOT_ALREADY_BOOKED';
          (err as any).status = 409;
          throw err;
        }

        // If currently reserved by another customer and not expired
        if (!isExpired && reservedBy && reservedBy !== authUser.uid) {
          const remainingSeconds = Math.max(0, Math.ceil((expiresAt - now) / 1000));
          const err = new Error('This appointment slot is temporarily reserved by another customer. Please choose another time or try again shortly.');
          (err as any).code = 'SLOT_TEMPORARILY_RESERVED';
          (err as any).status = 409;
          (err as any).details = {
            retryAfterSeconds: remainingSeconds
          };
          throw err;
        }
        // If unexpired AND reserved by the same user, or expired, we safely allow updating/re-locking
      }

      // Step C: Lock the slot for 10 minutes
      const newExpiresAt = now + TEN_MINUTES_MS;
      const reservationData = {
        slotId,
        date,
        time,
        serviceId,
        serviceName,
        category: category || 'General',
        price: price || 'Standard',
        userId: authUser.uid, // Always verified UID
        userEmail: authUser.email || '',
        userName: userName || authUser.token.name || 'Valued Client',
        status: 'reserved',
        reservedAt: new Date(now).toISOString(),
        expiresAt: newExpiresAt,
        expiresAtIso: new Date(newExpiresAt).toISOString(),
        updatedAt: new Date(now).toISOString(),
      };

      transaction.set(slotRef, reservationData);

      return {
        slotId,
        date,
        time,
        serviceName,
        expiresAt: newExpiresAt,
        expiresAtIso: new Date(newExpiresAt).toISOString(),
        expiresInSeconds: 600,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment slot reserved successfully for 10 minutes.',
        reservation: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 'SLOT_ALREADY_BOOKED' || error.code === 'SLOT_TEMPORARILY_RESERVED') {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details || null,
        },
        { status: error.status || 409 }
      );
    }

    console.error('Error reserving slot in transaction:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to reserve appointment slot. Please try again.',
        code: 'TRANSACTION_ERROR'
      },
      { status: 500 }
    );
  }
}

