import { NextRequest, NextResponse } from 'next/server';
import { getResend, FROM_EMAIL } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userName, userEmail, serviceName, date, time, category } = await req.json();
    console.log('Confirmation request received for:', userEmail);

    const resend = getResend();

    if (!resend) {
      console.error('Resend client not initialized');
      return NextResponse.json(
        { error: 'Email service not configured. Please check RESEND_API_KEY.' },
        { status: 503 }
      );
    }

    if (!userEmail || userEmail === 'No Email') {
      console.error('Invalid user email:', userEmail);
      return NextResponse.json(
        { error: 'Valid client email is required to send confirmation.' },
        { status: 400 }
      );
    }

    if (!serviceName || !date || !time) {
      console.error('Missing booking details:', { serviceName, date, time });
      return NextResponse.json(
        { error: 'Missing required booking details (service, date, or time).' },
        { status: 400 }
      );
    }

    console.log('Sending confirmation email to:', userEmail);
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: `Booking Confirmed: ${serviceName} at Best Salon — Best Creative Hub`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #f59e0b; text-transform: uppercase; letter-spacing: -1px;">BEST CREATIVE HUB <span style="color: #6b7280; font-size: 16px;">&bull; Best Salon</span></h1>
          <p style="font-size: 18px;">Hello <strong>${userName || 'Valued Client'}</strong>,</p>
          <p>Your appointment has been <strong>CONFIRMED</strong>! We look forward to seeing you.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; font-size: 16px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Appointment Details</h2>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${category || 'Salon'}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">Best Creative Hub &bull; Best Salon &bull; Block 1, Plot 7, Ogundola layout &bull; Akure</p>
        </div>
      `,
    });

    if (result.error) {
      console.error('Resend API returned error:', result.error);
      return NextResponse.json(
        { error: 'Resend API error', details: result.error },
        { status: 500 }
      );
    }

    console.log('Confirmation email sent successfully:', result);
    return NextResponse.json({ message: 'Confirmation email sent', result }, { status: 200 });
  } catch (err) {
    console.error('Resend confirmation error:', err);
    return NextResponse.json(
      { error: 'Failed to send email via Resend', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
