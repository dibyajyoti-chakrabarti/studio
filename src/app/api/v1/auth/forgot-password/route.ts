import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { Resend } from 'resend';

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
        const limiter = await rateLimit(`auth-forgot:${ip}`, 3, 60000);
        if (!limiter.success) {
            return rateLimitResponse(limiter.reset);
        }

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const { adminAuth } = getFirebaseAdmin();
        const resend = getResend();

        if (!adminAuth) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        // 1. Check if user exists (optional, could just return success to prevent email enumeration, but Firebase will throw if not found)
        try {
            await adminAuth.getUserByEmail(email);
        } catch (error: any) {
            // If user not found, silently return success to prevent email enumeration attacks
            if (error.code === 'auth/user-not-found') {
                return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
            }
            throw error; // Re-throw other errors
        }


        // 2. Generate a secure password reset link pointing to our custom page
        // The actionCodeSettings instruct Firebase to create a link like:
        // http://localhost:9002/reset-password?mode=resetPassword&oobCode=...
        const resetLink = await adminAuth.generatePasswordResetLink(email, {
            url: `${APP_URL}/reset-password`,
            handleCodeInApp: false
        });

        // The generated link looks like: 
        // https://[PROJECT_ID].firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=[CODE]...
        // We want to extract the oobCode to build our own clean URL so the user stays on our domain.
        const urlObj = new URL(resetLink);
        const oobCode = urlObj.searchParams.get('oobCode');

        if (!oobCode) {
            throw new Error("Failed to extract reset code from Firebase.");
        }

        const customResetUrl = `${APP_URL}/reset-password?oobCode=${oobCode}`;

        // 3. Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'MechHub <outreach@mechhub.in>',
            to: [email],
            subject: 'Reset Your MechHub Password',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%); padding: 32px; text-align: center; }
            .header h1 { margin: 0; color: white; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
            .content { padding: 40px; }
            .content h2 { color: #f8fafc; font-size: 20px; font-weight: 600; margin-top: 0; }
            .content p { color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
            .button-container { text-align: center; margin: 32px 0; }
            .button { background-color: #3b82f6; color: white !important; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; display: inline-block; font-size: 16px; transition: background-color 0.2s; }
            .button:hover { background-color: #2563eb; }
            .footer { background-color: #0f172a; padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
            .footer p { color: #64748b; font-size: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>MechHub</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset the password for your MechHub account associated with ${email}. If you made this request, please click the button below to choose a new password.</p>
              
              <div class="button-container">
                <a href="${customResetUrl}" class="button">Reset My Password</a>
              </div>
              
              <p style="font-size: 14px; text-align: center;">This link will expire soon.</p>
            </div>
            <div class="footer">
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
              <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} MechHub Platform</p>
            </div>
          </div>
        </body>
        </html>
      `
        });

        if (error) {
            console.error('Resend email error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });

    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
