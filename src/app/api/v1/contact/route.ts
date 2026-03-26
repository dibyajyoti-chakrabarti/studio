import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { Resend } from "resend";

let resendInstance: Resend | null = null;
const getResend = () => {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');
  }
  return resendInstance;
};

const NOTIFICATION_EMAILS = [
  'outreach@mechhub.in',
  'divyanshu.work914124@gmail.com',
  'ujjwal.roverx@gmail.com',
];

const ContactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(20).optional().default(''),
  company: z.string().max(200).optional().default(''),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const limiter = await rateLimit(`contact:${ip}`, 3, 60000);
    if (!limiter.success) {
      return rateLimitResponse(limiter.reset);
    }

    // 2. Validate
    const body = await request.json();
    const result = ContactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // 3. Save to Firestore
    const { adminFirestore } = getFirebaseAdmin();
    if (!adminFirestore) {
      throw new Error("Database connection failed");
    }

    const docRef = adminFirestore.collection('contactQueries').doc();
    const contactData = {
      id: docRef.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(contactData);

    // 4. Send email notifications via Resend
    try {
      const resend = getResend();
      const fullName = `${data.firstName} ${data.lastName}`;

      await resend.emails.send({
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
    } catch (emailError) {
      // Log but don't fail the request if email fails
      console.error('Contact email notification failed:', emailError);
    }

    return NextResponse.json({ success: true, queryId: docRef.id });

  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit your query. Please try again later." },
      { status: 500 }
    );
  }
}
