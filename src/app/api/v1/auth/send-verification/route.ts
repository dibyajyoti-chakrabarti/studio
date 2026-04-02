import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { Resend } from 'resend';
import crypto from 'crypto';

let resendInstance: Resend | null = null;
const getResend = () => {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY environment variable is not configured');
    }
    resendInstance = new Resend(key);
  }
  return resendInstance;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

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

    const normalizedEmail = String(email).trim().toLowerCase();
    const firebaseUser = await adminAuth.getUser(uid);
    if ((firebaseUser.email || '').toLowerCase() !== normalizedEmail) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    }

    if (firebaseUser.emailVerified) {
      return NextResponse.json({ success: true, message: 'Email already verified' });
    }

    // 1. Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    // 2. Save token to Firestore
    await adminFirestore.collection('verification_tokens').doc(token).set({
      uid,
      email: normalizedEmail,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      used: false,
    });

    // 3. Send email using Resend
    const verificationUrl = `${APP_URL}/api/v1/auth/verify?token=${token}`;
    const safeName = escapeHtml(name?.trim() || 'there');
    const safeEmail = escapeHtml(email);
    const currentYear = new Date().getFullYear();
    const subject = 'Verify your email address for MechHub';
    const previewText = 'Confirm your email to activate your MechHub workspace.';
    const fallbackUrl = verificationUrl.replace(/&/g, '&amp;');

    const { error } = await resend.emails.send({
      from: 'MechHub <outreach@mechhub.in>',
      to: [normalizedEmail],
      subject,
      text: `Hi ${name?.trim() || 'there'},

Welcome to MechHub. Please verify your email address to activate your account.

Verify email: ${verificationUrl}

For your security, this link expires in 24 hours. If you did not create a MechHub account, you can ignore this email.

MechHub
${APP_URL}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="x-apple-disable-message-reformatting" />
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #eef2f7;
              color: #0f172a;
              font-family: Georgia, Cambria, 'Times New Roman', Times, serif;
              -webkit-font-smoothing: antialiased;
            }
            .preheader {
              display: none !important;
              visibility: hidden;
              opacity: 0;
              color: transparent;
              height: 0;
              width: 0;
              overflow: hidden;
              mso-hide: all;
            }
            .wrapper {
              width: 100%;
              padding: 24px 10px;
              background-color: #eef2f7;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 1px solid #d4dbe6;
              border-radius: 14px;
              overflow: hidden;
            }
            .topbar {
              padding: 16px 22px;
              background-color: #ffffff;
              border-bottom: 1px solid #e2e8f0;
            }
            .brand {
              margin: 0;
              color: #1e3a66;
              font-size: 38px;
              font-weight: 700;
              letter-spacing: -0.01em;
              line-height: 1;
            }
            .hero {
              background-color: #2f5fa7;
              padding: 28px 28px 24px;
            }
            .hero-pill {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 999px;
              border: 1px solid #6d86b8;
              color: #e9f0ff;
              font-size: 11px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              font-weight: 700;
            }
            .hero-title {
              margin: 14px 0 8px;
              color: #ffffff;
              font-size: 34px;
              font-weight: 700;
              line-height: 1.04;
              text-transform: uppercase;
              letter-spacing: 0.01em;
            }
            .hero-subtitle {
              margin: 0;
              color: #99e5f0;
              font-size: 23px;
              text-transform: uppercase;
              letter-spacing: 0.03em;
              font-weight: 700;
              line-height: 1.1;
            }
            .content {
              padding: 26px 28px 20px;
            }
            .title {
              margin: 0 0 12px;
              font-size: 22px;
              line-height: 1.3;
              color: #1e3a66;
              font-weight: 700;
            }
            .paragraph {
              margin: 0 0 14px;
              font-size: 15px;
              line-height: 1.7;
              color: #334155;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .cta-wrap {
              margin: 26px 0 20px;
              text-align: center;
            }
            .cta {
              display: inline-block;
              padding: 14px 28px;
              border-radius: 999px;
              background-color: #ffffff;
              border: 2px solid #2f5fa7;
              color: #2f5fa7 !important;
              text-decoration: none;
              font-size: 15px;
              font-weight: 700;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .meta {
              margin: 0;
              font-size: 13px;
              line-height: 1.6;
              color: #64748b;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .link-box {
              margin: 18px 0 0;
              padding: 12px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
              background-color: #f6f9ff;
              word-break: break-all;
              font-size: 12px;
              line-height: 1.6;
              color: #334155;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .footer {
              padding: 16px 28px 26px;
              background-color: #f8fafc;
            }
            .rule {
              height: 1px;
              background-color: #e2e8f0;
              margin-bottom: 14px;
            }
            .footer-text {
              margin: 0;
              color: #64748b;
              font-size: 12px;
              line-height: 1.6;
              text-align: center;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="preheader">${previewText}</div>
          <div class="wrapper">
            <div class="container">
              <div class="topbar">
                <h1 class="brand">MechHub</h1>
              </div>
              <div class="hero">
                <span class="hero-pill">Built in India for Builders</span>
                <h2 class="hero-title">Custom Manufacturing</h2>
                <p class="hero-subtitle">Made Fast & Affordable</p>
              </div>
              <div class="content">
                <h2 class="title">Verify your email address</h2>
                <p class="paragraph">Hi ${safeName},</p>
                <p class="paragraph">Thanks for creating your MechHub account with <strong>${safeEmail}</strong>. Please confirm your email address to activate your workspace and continue securely.</p>

                <div class="cta-wrap">
                  <a href="${verificationUrl}" class="cta">Verify Email</a>
                </div>

                <p class="meta">This secure link expires in 24 hours.</p>
                <p class="meta">If the button does not work, copy and paste this URL into your browser:</p>
                <div class="link-box">${fallbackUrl}</div>
              </div>
              <div class="footer">
                <div class="rule"></div>
                <p class="footer-text">If you did not create a MechHub account, you can safely ignore this email.</p>
                <p class="footer-text">&copy; ${currentYear} MechHub Technologies. All rights reserved.</p>
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
        email: normalizedEmail,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Verification email sent' });
  } catch (error: any) {
    logger.error({
      event: 'verification_email_process_failed',
      error: error.message,
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
