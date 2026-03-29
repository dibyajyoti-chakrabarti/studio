import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { Resend } from 'resend';
import crypto from 'crypto';

let resendInstance: Resend | null = null;
const getResend = () => {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');
  }
  return resendInstance;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limiter = await rateLimit(`auth-verify:${ip}`, 3, 60000);
    if (!limiter.success) {
      return rateLimitResponse(limiter.reset);
    }

    const { email, name, uid } = await req.json();

    if (!email || !uid) {
      return NextResponse.json({ error: 'Email and UID are required' }, { status: 400 });
    }

    const { adminFirestore, adminAuth } = getFirebaseAdmin();
    const resend = getResend();

    if (!adminFirestore || !adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // 1. Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    // 2. Save token to Firestore
    await adminFirestore.collection('verification_tokens').doc(token).set({
      uid,
      email,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      used: false,
    });

    // 3. Send email using Resend
    const verificationUrl = `${APP_URL}/api/v1/auth/verify?token=${token}`;
    const safeName = name || 'Innovator';

    const { data, error } = await resend.emails.send({
      from: 'MechHub <outreach@mechhub.in>',
      to: [email],
      subject: 'Verify your MechHub Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 40px; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
            .header { background-color: #1e3a66; padding: 40px 32px; text-align: center; }
            .logo { height: 40px; width: auto; margin-bottom: 16px; }
            .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; text-transform: uppercase; }
            .content { padding: 48px 40px; }
            .content h2 { color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.01em; }
            .content p { color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
            .button-container { text-align: center; margin: 40px 0; }
            .button { background-color: #2f5fa7; color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 16px 36px; border-radius: 8px; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; transition: background-color 0.2s; }
            .footer { background-color: #f1f5f9; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { color: #64748b; font-size: 12px; margin: 4px 0; font-weight: 500; }
            .footer a { color: #2f5fa7; text-decoration: none; font-weight: 600; }
            .divider { height: 1px; background-color: #e2e8f0; margin: 32px 0; }
            .badge { display: inline-block; background-color: #e2e8f0; color: #475569; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>MechHub</h1>
              </div>
              <div class="content">
                <div class="badge">Security Verification</div>
                <h2>Welcome to the Network, ${safeName}</h2>
                <p>You've recently created an account on the MechHub managed manufacturing platform. To ensure high-security standards for Industry  projects, please verify your email address to activate your innovator workspace.</p>
                
                <div class="button-container">
                  <a href="${verificationUrl}" class="button">Activate Workspace</a>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-bottom: 0;">This activation link will expire in 24 hours.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} MechHub Technologies. All rights reserved.</p>
                <p>Managed Manufacturing • Secure Supply Chain • CNC & 3D Fabrication</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      logger.error({
        event: 'email_send_failed',
        error: error.message,
        email,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Verification email sent' });
  } catch (error: any) {
    logger.error({
      event: 'verification_email_process_failed',
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
