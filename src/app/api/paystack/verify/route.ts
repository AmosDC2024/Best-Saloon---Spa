import { NextRequest, NextResponse } from 'next/server';
import { processPaystackTransaction } from '@/lib/paymentProcessor';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: { reference?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body.', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }

  const { reference } = body;

  if (!reference || typeof reference !== 'string' || reference.trim().length === 0) {
    return NextResponse.json(
      { error: 'A valid Paystack transaction reference is required.', code: 'MISSING_REFERENCE' },
      { status: 400 }
    );
  }

  try {
    const result = await processPaystackTransaction(reference.trim());

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || 'Payment verification failed.',
          code: 'VERIFICATION_FAILED',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.alreadyProcessed
          ? 'Payment previously verified and confirmed.'
          : 'Payment verified and appointment booking created successfully.',
        bookingId: result.bookingId,
        alreadyProcessed: result.alreadyProcessed || false,
        latePaymentConflict: result.latePaymentConflict || false,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Server error during payment verification:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error verifying payment.',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

