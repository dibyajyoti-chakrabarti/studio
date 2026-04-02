import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { logger } from '@/utils/logger';

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

const NOTIFICATION_EMAILS = [
  'outreach@mechhub.in',
  'divyanshu.work914124@gmail.com',
  'ujjwal.roverx@gmail.com',
];

const NotifySchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional().default(''),
  company: z.string().max(200).optional().default(''),
  message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const limiter = await rateLimit(`contact-notify:${ip}`, 5, 60000);
    if (!limiter.success) {
      return rateLimitResponse(limiter.reset);
    }

    const body = await request.json();
    const result = NotifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const data = result.data;
    const resend = getResend();
    const fullName = `${data.firstName} ${data.lastName}`;

    const { error } = await resend.emails.send({
      from: 'MechHub <outreach@mechhub.in>',
      to: NOTIFICATION_EMAILS,
      subject: `New Contact Query from ${fullName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #1E3A66 0%, #2F5FA7 100%); padding: 32px; }
    .header h1 { margin: 0; color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.7); font-size: 13px; }
    .content { padding: 32px; }
    .field { margin-bottom: 20px; }
    .field-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #0f172a; font-weight: 500; line-height: 1.5; }
    .message-box { background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 4px; }
    .footer { background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Query</h1>
      <p>Submitted via mechhub.in/contact</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Name</div>
        <div class="field-value">${fullName}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${data.email}" style="color: #2F5FA7; text-decoration: none;">${data.email}</a></div>
      </div>
      ${data.phone ? `<div class="field"><div class="field-label">Phone</div><div class="field-value">${data.phone}</div></div>` : ''}
      ${data.company ? `<div class="field"><div class="field-label">Company</div><div class="field-value">${data.company}</div></div>` : ''}
      <div class="field">
        <div class="field-label">Message</div>
        <div class="message-box">
          <div class="field-value">${data.message.replace(/\n/g, '<br/>')}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} MechHub &mdash; A Unit of Synchubb Innovations Pvt Ltd</p>
    </div>
  </div>
</body>
</html>
            `,
    });

    if (error) {
      logger.error({ event: 'contact_notify_email_failed', error: error.message });
      return NextResponse.json({ error: 'Email notification failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error({ event: 'contact_notify_unexpected_error', error: error.message });
    return NextResponse.json({ error: 'Email notification failed' }, { status: 500 });
  }
}
