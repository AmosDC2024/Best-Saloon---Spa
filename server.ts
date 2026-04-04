import express from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let resendClient: Resend | null = null;
const getResend = () => {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn('RESEND_API_KEY is missing. Email features will be disabled.');
      return null;
    }
    resendClient = new Resend(key);
  }
  return resendClient;
};

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'best salon services & creative hub <onboarding@resend.dev>';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check (at the very top)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  const distPath = path.resolve(__dirname, 'dist');
  const indexExists = fs.existsSync(path.join(distPath, 'index.html'));
  
  // 2. Serve static files with high priority in production
  if (indexExists) {
    console.log('Serving production build from:', distPath);
    app.use(express.static(distPath));
    app.use('/assets', express.static(path.join(distPath, 'assets')));
  } else {
    // Fallback to Vite in development
    console.log('Development mode: Starting Vite middleware');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // 3. API Routes
  // API Route for sending booking notification to Admin ONLY (initial booking)
  app.post('/api/notify-admin-booking', async (req, res) => {
    const { userName, userEmail, serviceName, date, time, category } = req.body;
    const resend = getResend();

    if (!resend) {
      return res.status(503).json({ error: 'Email service not configured' });
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [process.env.ADMIN_EMAIL || 'osiamijnr@gmail.com'],
        subject: `New Booking Request: ${serviceName} - ${userName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #f59e0b;">New Appointment Request</h1>
            <p><strong>Client:</strong> ${userName} (${userEmail})</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 10px;">
              <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
            </div>
            <p>This appointment is currently <strong>PENDING</strong>. Please log in to the dashboard to confirm or reschedule.</p>
            <p style="margin-top: 20px;"><a href="${process.env.APP_URL || ''}" style="color: #f59e0b; font-weight: bold; text-decoration: none;">View in Admin Dashboard</a></p>
          </div>
        `,
      });
      res.status(200).json({ message: 'Admin notified' });
    } catch (err) {
      console.error('Notification error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API Route for sending the testing link to the admin
  app.post('/api/send-test-link', async (req, res) => {
    const { email } = req.body;
    const resend = getResend();

    if (!resend) {
      return res.status(503).json({ error: 'Email service not configured' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const testLink = 'https://ais-pre-htn43e6zff3d6tqo54gu7b-182291592896.europe-west2.run.app';

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: `Your Testing Link - best salon services & creative hub`,
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
            <p style="text-align: center; color: #9ca3af; font-size: 12px;">best salon services & creative hub &bull; Admin Tools</p>
          </div>
        `,
      });

      res.status(200).json({ message: 'Testing link sent successfully' });
    } catch (err) {
      console.error('Send test link error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API Route for sending booking confirmation emails (triggered by Admin)
  app.post('/api/send-confirmation', async (req, res) => {
    const { userName, userEmail, serviceName, date, time, category } = req.body;
    console.log('Confirmation request received for:', userEmail);
    
    const resend = getResend();

    if (!resend) {
      console.error('Resend client not initialized');
      return res.status(503).json({ error: 'Email service not configured. Please check RESEND_API_KEY.' });
    }

    if (!userEmail || userEmail === 'No Email') {
      console.error('Invalid user email:', userEmail);
      return res.status(400).json({ error: 'Valid client email is required to send confirmation.' });
    }

    if (!serviceName || !date || !time) {
      console.error('Missing booking details:', { serviceName, date, time });
      return res.status(400).json({ error: 'Missing required booking details (service, date, or time).' });
    }

    try {
      console.log('Sending confirmation email to:', userEmail);
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: [userEmail],
        subject: `Booking Confirmed: ${serviceName} at best salon services & creative hub`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #f59e0b; text-transform: uppercase; letter-spacing: -1px;">best salon services <span style="color: #000;">& creative hub</span></h1>
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
            <p style="text-align: center; color: #9ca3af; font-size: 12px;">best salon services & creative hub &bull; Block 1, Plot 7, Ogundola layout &bull; Akure</p>
          </div>
        `,
      });

      if (result.error) {
        console.error('Resend API returned error:', result.error);
        return res.status(500).json({ error: 'Resend API error', details: result.error });
      }

      console.log('Confirmation email sent successfully:', result);
      res.status(200).json({ message: 'Confirmation email sent', result });
    } catch (err) {
      console.error('Resend confirmation error:', err);
      res.status(500).json({ error: 'Failed to send email via Resend', details: err instanceof Error ? err.message : String(err) });
    }
  });

  // API Route for sending rescheduling emails (triggered by Admin)
  app.post('/api/send-reschedule', async (req, res) => {
    const { userName, userEmail, serviceName, originalDate, originalTime, suggestedDate, suggestedTime, message } = req.body;
    const resend = getResend();

    if (!resend) {
      return res.status(503).json({ error: 'Email service not configured' });
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [userEmail],
        subject: `Rescheduling Request: ${serviceName} at best salon services & creative hub`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #f59e0b;">Rescheduling Request</h1>
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Regarding your appointment for <strong>${serviceName}</strong> originally scheduled for ${originalDate} at ${originalTime}.</p>
            
            <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; border: 1px solid #ffedd5; margin: 20px 0;">
              <p style="margin: 0; color: #9a3412;"><strong>Message from Admin:</strong></p>
              <p style="margin: 10px 0;">${message || 'We are unable to accommodate your original time slot. Would you like to reschedule?'}</p>
              ${suggestedDate ? `<p style="margin: 10px 0;"><strong>Suggested New Time:</strong> ${suggestedDate} at ${suggestedTime}</p>` : ''}
            </div>
            
            <p>Please contact us at +234 806 805 9823 or reply to this email to confirm a new time.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="text-align: center; color: #9ca3af; font-size: 12px;">best salon services & creative hub &bull; Block 1, Plot 7, Ogundola layout &bull; Akure</p>
          </div>
        `,
      });
      res.status(200).json({ message: 'Reschedule email sent' });
    } catch (err) {
      console.error('Reschedule error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API Route for sending contact form emails
  app.post('/api/send-contact-email', async (req, res) => {
    const { name, email, subject, message } = req.body;
    const resend = getResend();

    if (!resend) {
      return res.status(503).json({ error: 'Email service not configured' });
    }

    if (!email || !name || !message) {
      return res.status(400).json({ error: 'Missing required contact details' });
    }

    try {
      // 1. Send notification to Salon Staff
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [process.env.ADMIN_EMAIL || 'osiamijnr@gmail.com'], // Notify the owner
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
        subject: `We received your message - best salon services & creative hub`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #f59e0b;">Hello ${name},</h1>
            <p>Thank you for reaching out to best salon services & creative hub. We have received your message regarding "<strong>${subject || 'General Inquiry'}</strong>".</p>
            <p>Our team will review your message and get back to you as soon as possible (usually within 24 hours).</p>
            <p>If this is an emergency or you'd like to book immediately, please call us at +234 806 805 9823.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="text-align: center; color: #9ca3af; font-size: 12px;">best salon services & creative hub &bull; Block 1, Plot 7, Ogundola layout &bull; Akure</p>
          </div>
        `,
      });

      res.status(200).json({ message: 'Emails sent successfully' });
    } catch (err) {
      console.error('Contact email error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // 4. Final Catch-all for SPA (MUST be at the end)
  app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      // Fallback for development
      res.status(404).send('App is initializing. Please refresh in 5 seconds.');
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
