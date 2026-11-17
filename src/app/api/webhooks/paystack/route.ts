import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { processPaystackTransaction } from '@/lib/paymentProcessor';

export const dynamic = 'force-dynamic';

/**
 * Validates the Paystack webhook signature using HMAC SHA-512 with timing-safe comparison.
 */
function isValidPaystackSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) {
    return false;
  }

  const computedHash = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex');

  try {
    const computedBuffer = Buffer.from(computedHash, 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (computedBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuffer, signatureBuffer);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecretKey) {
    console.error('PAYSTACK_SECRET_KEY is missing during webhook reception.');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
  }

  // 1. Read raw body text for cryptographic verification
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    console.error('Failed to read webhook raw body:', err);
    return NextResponse.json({ error: 'Could not read request body' }, { status: 400 });
  }

  // 2. Validate HMAC SHA-512 signature
  const signature = req.headers.get('x-paystack-signature');
  if (!isValidPaystackSignature(rawBody, signature, paystackSecretKey)) {
    console.warn('Unauthorized webhook delivery attempt: invalid x-paystack-signature.');
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  // 3. Parse JSON event payload
  let eventPayload: any;
  try {
    eventPayload = JSON.parse(rawBody);
  } catch (parseErr) {
    console.error('Failed to parse webhook JSON:', parseErr);
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { event, data } = eventPayload;

  // 4. Handle 'charge.success' events
  if (event === 'charge.success' && data && data.reference) {
    try {
      const result = await processPaystackTransaction(data.reference, data);
      
      if (!result.success) {
        console.error('Webhook processing error for reference:', data.reference, result.error);
        // Still return 200 to acknowledge receipt so Paystack does not flood retries on logic errors
        return NextResponse.json(
          { message: 'Event received with processing notice', details: result.error },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          message: 'Charge success handled successfully',
          bookingId: result.bookingId,
          alreadyProcessed: result.alreadyProcessed || false,
        },
        { status: 200 }
      );
    } catch (processErr) {
      console.error('Unexpected error processing webhook charge.success:', processErr);
      return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
    }
  }

  // Acknowledge other unhandled Paystack event types (e.g. transfer.success, subscription.create)
  return NextResponse.json({ message: `Event "${event}" received and ignored` }, { status: 200 });
}

