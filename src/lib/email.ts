import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

export const getEmailTransporter = (): Transporter | null => {
  const host = process.env.SMTP_HOST || 'mail.privateemail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== undefined 
    ? process.env.SMTP_SECURE === 'true' 
    : port === 465;
  const user = process.env.SMTP_USER || 'admin@bestcreativehub.com';
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (!pass) {
    console.warn('SMTP_PASSWORD is missing. Email features will be disabled.');
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
    });
  }

  return transporter;
};

// Administrative and application routing
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bestcreativehub.com';
export const APP_URL = process.env.APP_URL || 'https://bestcreativehub.com';

// Sender Aliases on Namecheap Private Email (authenticated via admin@bestcreativehub.com)
export const FROM_BOOKINGS = process.env.SMTP_FROM_BOOKINGS || 'Best Creative Hub Bookings <bookings@bestcreativehub.com>';
export const FROM_SALON = process.env.SMTP_FROM_SALON || 'Best Salon & Spa <bookings@bestcreativehub.com>';
export const FROM_CONTACT = process.env.SMTP_FROM_CONTACT || 'Best Creative Hub Concierge <contact@bestcreativehub.com>';
export const FROM_INFO = process.env.SMTP_FROM_INFO || 'Best Creative Hub <info@bestcreativehub.com>';
export const FROM_ADMIN = process.env.SMTP_FROM_ADMIN || 'Best Creative Hub Admin <admin@bestcreativehub.com>';

// Default fallback sender
export const FROM_EMAIL = FROM_INFO;

export interface SendEmailOptions {
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  response?: string;
  error?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<SendEmailResult> => {
  const mailer = getEmailTransporter();
  if (!mailer) {
    return {
      success: false,
      error: 'Email service not configured. Please check SMTP_PASSWORD.',
    };
  }

  const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;
  const info = await mailer.sendMail({
    from: options.from,
    to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
  });

  return {
    success: true,
    messageId: info.messageId,
    response: info.response,
  };
};
