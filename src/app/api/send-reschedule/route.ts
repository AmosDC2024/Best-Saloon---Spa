import { NextRequest, NextResponse } from 'next/server';
import { getResend, FROM_EMAIL } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userName, userEmail, serviceName, originalDate, originalTime, suggestedDate, suggestedTime, message } = await req.json();
    const resend = getResend();

    if (!resend) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [userEmail],
      subject: `Rescheduling Request: ${serviceName} at Best Salon — Best Creative Hub`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #f59e0b;">Rescheduling Request &bull; Best Creative Hub</h1>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Regarding your appointment for <strong>${serviceName}</strong> originally scheduled for ${originalDate} at ${originalTime}.</p>
          
          <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; border: 1px solid #ffedd5; margin: 20px 0;">
            <p style="margin: 0; color: #9a3412;"><strong>Message from Admin:</strong></p>
            <p style="margin: 10px 0;">${message || 'We are unable to accommodate your original time slot. Would you like to reschedule?'}</p>
            ${suggestedDate ? `<p style="margin: 10px 0;"><strong>Suggested New Time:</strong> ${suggestedDate} at ${suggestedTime}</p>` : ''}
          </div>
          
          <p>Please contact us at +234 806 805 9823 or reply to this email to confirm a new time.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">Best Creative Hub &bull; Best Salon &bull; Block 1, Plot 7, Ogundola layout &bull; Akure</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Reschedule email sent' }, { status: 200 });
  } catch (err) {
    console.error('Reschedule error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
