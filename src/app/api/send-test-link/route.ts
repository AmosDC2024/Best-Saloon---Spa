import { NextRequest, NextResponse } from 'next/server';
import { getEmailTransporter, sendEmail, FROM_ADMIN, APP_URL } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const mailer = getEmailTransporter();

    if (!mailer) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const testLink = APP_URL;

    const result = await sendEmail({
      from: FROM_ADMIN,
      to: [email],
      subject: `Your Testing Link - Best Creative Hub`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #f59e0b;">Your Testing Link</h1>
          <p>Hello,</p>
          <p>Here is the link to your application for testing and review before final deployment:</p>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <a href="${testLink}" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #000; text-decoration: none; font-weight: bold; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">Open Testing App</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">URL: <a href="${testLink}" style="color: #f59e0b;">${testLink}</a></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">Best Creative Hub &bull; Admin Tools</p>
        </div>
      `,
    });

    if (!result.success) {
      console.error('Send test link error:', result.error);
      return NextResponse.json({ error: 'Failed to send test link email', details: result.error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Testing link sent successfully' }, { status: 200 });
  } catch (err) {
    console.error('Send test link error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
