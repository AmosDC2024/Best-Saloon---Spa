import { NextRequest, NextResponse } from 'next/server';
import { getResend, FROM_EMAIL, ADMIN_EMAIL, APP_URL } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userName, userEmail, serviceName, date, time, category } = await req.json();
    const resend = getResend();

    if (!resend) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `New Booking Request: ${serviceName} - ${userName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #f59e0b;">New Appointment Request</h1>
          <p><strong>Client:</strong> ${userName} (${userEmail})</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${category || 'Salon'}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
          </div>
          <p>This appointment is currently <strong>PENDING</strong>. Please log in to the dashboard to confirm or reschedule.</p>
          <p style="margin-top: 20px;"><a href="${APP_URL}" style="color: #f59e0b; font-weight: bold; text-decoration: none;">View in Admin Dashboard</a></p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Admin notified' }, { status: 200 });
  } catch (err) {
    console.error('Notification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
