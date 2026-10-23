import { NextRequest, NextResponse } from 'next/server';
import { getResend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    const resend = getResend();

    if (!resend) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    if (!email || !name || !message) {
      return NextResponse.json({ error: 'Missing required contact details' }, { status: 400 });
    }

    // 1. Send notification to Salon Staff / Owner
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `New Contact Message: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #f59e0b;">New Message Received</h1>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p style="margin: 0;">${message}</p>
          </div>
        </div>
      `,
    });

    // 2. Send Auto-reply to the User
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `We received your message - Best Creative Hub`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #f59e0b;">Hello ${name},</h1>
          <p>Thank you for reaching out to Best Creative Hub. We have received your message regarding "<strong>${subject || 'General Inquiry'}</strong>".</p>
          <p>Our team will review your message and get back to you as soon as possible (usually within 24 hours).</p>
          <p>If this is an emergency or you'd like to book immediately, please call us at +234 806 805 9823.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">Best Creative Hub &bull; Block 1, Plot 7, Ogundola layout &bull; Akure</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
  } catch (err) {
    console.error('Contact email error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
