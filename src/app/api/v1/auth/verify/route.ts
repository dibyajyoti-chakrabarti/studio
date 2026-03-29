import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { isAdmin } from '@/lib/auth-utils';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    // Redirect base URL
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const loginUrl = `${APP_URL}/login`;

    if (!token) {
      return NextResponse.redirect(`${loginUrl}?error=missing_token`);
    }

    const { adminFirestore, adminAuth } = getFirebaseAdmin();

    if (!adminFirestore || !adminAuth) {
      return NextResponse.redirect(`${loginUrl}?error=server_error`);
    }

    // 1. Find the token document
    const tokenRef = adminFirestore.collection('verification_tokens').doc(token);
    const tokenDoc = await tokenRef.get();

    if (!tokenDoc.exists) {
      return NextResponse.redirect(`${loginUrl}?error=invalid_token`);
    }

    const tokenData = tokenDoc.data();

    // 2. Check if token is expired or already used
    if (tokenData?.used) {
      return NextResponse.redirect(`${loginUrl}?error=already_verified`);
    }

    const now = new Date();
    const expiresAt = new Date(tokenData?.expiresAt);

    if (now > expiresAt) {
      return NextResponse.redirect(`${loginUrl}?error=expired_token`);
    }

    const { uid, email } = tokenData!;

    // 3. Mark user as verified in Firebase Auth using Admin SDK
    await adminAuth.updateUser(uid, {
      emailVerified: true,
    });

    // 4. Update the User profile in Firestore (use set with merge since it might not exist yet)
    await adminFirestore
      .collection('users')
      .doc(uid)
      .set(
        {
          emailVerified: true,
          status: 'active',
          email: email,
          role: isAdmin(email) ? 'admin' : 'customer',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    // 5. Mark token as used
    await tokenRef.update({
      used: true,
      verifiedAt: new Date().toISOString(),
    });

    // 6. Redirect to login with success flag
    return NextResponse.redirect(`${loginUrl}?verified=true`);
  } catch (error: any) {
    console.error('Verification error:', error);
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    return NextResponse.redirect(`${APP_URL}/login?error=verification_failed`);
  }
}
