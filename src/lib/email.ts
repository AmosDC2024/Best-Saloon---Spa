import { Resend } from 'resend';

let resendClient: Resend | null = null;

export const getResend = () => {
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

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Best Creative Hub <onboarding@resend.dev>';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'osiamijnr@gmail.com';
export const APP_URL = process.env.APP_URL || '';
