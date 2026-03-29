import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

/**
 * SESSION MANAGEMENT API
 * 
 * POST: Exchanges a Firebase ID Token for a server-side HttpOnly session cookie.
 * DELETE: Clears the session cookie (Logout).
 */

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limiter = await rateLimit(`auth-session:${ip}`, 5, 60000); // 5 attempts per minute
    
    if (!limiter.success) {
      return rateLimitResponse(limiter.reset);
    }

    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID Token is required' }, { status: 400 });
    }

    const { adminAuth } = getFirebaseAdmin();
    if (!adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Create the session cookie. This will also verify the ID token in the process.
    // The library will throw an error if the ID token is invalid, expired, or not signed by the relevant project.
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ status: 'success' }, { status: 200 });

    // Set cookie parameters
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error: any) {
    logger.error({
      event: 'session_creation_failed',
      error: error.message,
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'logged-out' }, { status: 200 });
  
  // Clear the session cookie
  response.cookies.set('session', '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}
