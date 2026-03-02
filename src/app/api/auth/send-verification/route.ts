import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
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

export async function POST(req: Request) {
    try {
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
            used: false
        });

        // 3. Send email using Resend
        const verificationUrl = `${APP_URL}/api/auth/verify?token=${token}`;
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
              <h2>Welcome to MechHub, ${safeName}!</h2>
              <p>Thanks for joining the platform that brings manufacturing from CAD to reality faster. To get started and access your dashboard, please verify your email address.</p>
              
              <div class="button-container">
                <a href="${verificationUrl}" class="button">Verify My Account</a>
              </div>
              
              <p style="font-size: 14px; text-align: center;">This link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>If you didn't create this account, you can safely ignore this email.</p>
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

        return NextResponse.json({ success: true, message: 'Verification email sent' });

    } catch (error: any) {
        console.error('Send verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
