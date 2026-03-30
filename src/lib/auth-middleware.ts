import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';

export interface AuthResult {
  success: true;
  uid: string;
  email?: string;
  emailVerified?: boolean;
  role?: string;
}

export interface AuthError {
  success: false;
  error: string;
  status: number;
}

export type AuthResponse = AuthResult | AuthError;

/**
 * Authenticates a request using either:
 * 1. Session cookie (session cookie in cookies)
 * 2. Bearer token (Authorization header with Firebase ID token)
 * 
 * Returns the authenticated user's uid and claims.
 */
export async function authenticateRequest(req: NextRequest): Promise<AuthResponse> {
  const { adminAuth, adminFirestore } = getFirebaseAdmin();

  if (!adminAuth) {
    return { success: false, error: 'Auth service unavailable', status: 500 };
  }

  // Try session cookie first
  const sessionCookie = req.cookies.get('session')?.value;
  
  if (sessionCookie) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      return {
        success: true,
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        emailVerified: decodedClaims.email_verified,
      };
    } catch (error: any) {
      logger.warn({ event: 'Session cookie invalid, trying Bearer token', error: error.message });
    }
  }

  // Try Bearer token (Firebase ID token)
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken, true);
      
      let role: string | undefined;
      if (adminFirestore) {
        try {
          const userDoc = await adminFirestore.collection('users').doc(decodedToken.uid).get();
          role = userDoc.data()?.role;
        } catch {
          // Ignore role fetch errors
        }
      }

      return {
        success: true,
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        role,
      };
    } catch (error: any) {
      logger.warn({ event: 'Bearer token verification failed', error: error.message });
      return { success: false, error: 'Invalid or expired token', status: 401 };
    }
  }

  return { success: false, error: 'Authentication required', status: 401 };
}

/**
 * Helper to create a standardized unauthorized response
 */
export function unauthorizedResponse(message = 'Authentication required'): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Helper to create a standardized forbidden response
 */
export function forbiddenResponse(message = 'Access denied'): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}
