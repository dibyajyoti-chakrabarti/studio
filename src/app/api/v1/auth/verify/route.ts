import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { isAdmin } from '@/lib/auth-utils';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { getClientIdentifier } from '@/lib/auth-safety';
import { NotificationService } from '@/services/notification.service';

export async function GET(req: Request) {
  try {
    const ip = getClientIdentifier(req.headers);
    const limiter = await rateLimit(`auth-verify-attempt:${ip}`, 5, 60000); // 5 attempts per minute

    if (!limiter.success) {
      return rateLimitResponse(limiter.reset);
    }

    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    // Redirect base URL
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const loginUrl = `${APP_URL}/login`;

    if (!token) {
      return NextResponse.redirect(`${loginUrl}?error=missing_token`);
    }

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return NextResponse.redirect(`${loginUrl}?error=invalid_token`);
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

    // 4. Update the User profile in Firestore
    const existingUserSnap = await adminFirestore.collection('users').doc(uid).get();
    const existingRole = existingUserSnap.data()?.role;
    const userRole = existingRole || (isAdmin(email) ? 'admin' : 'customer');
    
    await adminFirestore
      .collection('users')
      .doc(uid)
      .set(
        {
          emailVerified: true,
          status: 'active',
          email: email,
          role: userRole,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    // 4.1 Set Custom Claims if admin
    if (userRole === 'admin') {
      try {
        await adminAuth.setCustomUserClaims(uid, { admin: true });
      } catch (claimError) {
        console.error('Failed to set admin claim:', claimError);
      }
    }

    // 5. Mark token as used
    await tokenRef.update({
      used: true,
      verifiedAt: new Date().toISOString(),
    });

    // 6. Send welcome email to customer + notify admins
    const userName = tokenData?.name || email.split('@')[0] || 'there';
    NotificationService.sendAllAsync([
      {
        type: 'welcome',
        customer: { email, name: userName },
      },
      {
        type: 'admin_new_user',
        userName,
        userEmail: email,
      },
    ]);

    // 7. Redirect to login with success flag
    return NextResponse.redirect(`${loginUrl}?verified=true`);
  } catch (error: any) {
    console.error('Verification error:', error);
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    return NextResponse.redirect(`${APP_URL}/login?error=verification_failed`);
  }
}
