import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';

/**
 * Dedicated Firestore database ID used by Best Creative Hub.
 */
export const CUSTOM_FIRESTORE_DATABASE_ID = 'ai-studio-b32c70e4-f47a-414a-91d3-e027f7dc08e3';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

/**
 * Initializes and returns the Firebase Admin App instance.
 * Prevents duplicate initialization across hot reloads or serverless invocations.
 */
export function getAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    adminApp = existingApps[0];
    return adminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  } else {
    // Fall back to environment-based project ID or default configuration
    adminApp = initializeApp({
      projectId: projectId || 'gen-lang-client-0990155658',
    });
  }

  return adminApp;
}

/**
 * Returns the Admin Firestore instance connected to the custom database ID.
 */
export function getAdminFirestore(): Firestore {
  if (adminDb) {
    return adminDb;
  }
  const app = getAdminApp();
  adminDb = getFirestore(app, CUSTOM_FIRESTORE_DATABASE_ID);
  return adminDb;
}

/**
 * Returns the Admin Auth instance.
 */
export function getAdminAuth(): Auth {
  if (adminAuth) {
    return adminAuth;
  }
  const app = getAdminApp();
  adminAuth = getAuth(app);
  return adminAuth;
}

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  token: DecodedIdToken;
}

/**
 * Reusable helper to extract and verify a Firebase Auth ID token from a Request, NextRequest,
 * Headers instance, or raw header string.
 *
 * Enforces "Authorization: Bearer <token>" and rejects missing, malformed, or invalid tokens.
 * Returns the authenticated user's verified UID, email, and full decoded token.
 */
export async function verifyAuthToken(
  input: Request | NextRequest | Headers | string,
  checkRevoked: boolean = false
): Promise<AuthenticatedUser> {
  let authHeader: string | null = null;

  if (typeof input === 'string') {
    authHeader = input;
  } else if ('headers' in input && input.headers instanceof Headers) {
    authHeader = input.headers.get('authorization') || input.headers.get('Authorization');
  } else if (input instanceof Headers) {
    authHeader = input.get('authorization') || input.get('Authorization');
  }

  if (!authHeader) {
    throw new Error('Missing Authorization header. Expected "Authorization: Bearer <token>".');
  }

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match || !match[1]) {
    throw new Error('Malformed Authorization header. Format must be "Bearer <token>".');
  }

  const idToken = match[1].trim();
  if (!idToken) {
    throw new Error('Empty Firebase Auth ID token provided.');
  }

  const auth = getAdminAuth();
  const decodedToken = await auth.verifyIdToken(idToken, checkRevoked);

  if (!decodedToken || !decodedToken.uid) {
    throw new Error('Invalid token: user identifier (UID) could not be verified.');
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    token: decodedToken,
  };
}

