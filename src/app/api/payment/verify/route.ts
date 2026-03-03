import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps, initializeApp, cert } from 'firebase-admin/app';

// ── Firebase Admin init (reuse if already initialised) ─────────────────────
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            rfqId,
            paymentType,
            userId,
        } = await req.json() as {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
            rfqId: string;
            paymentType: 'advance' | 'completion';
            userId: string;
        };

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !rfqId || !paymentType || !userId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // ── Verify HMAC-SHA256 signature ─────────────────────────────────────────
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.warn('[verify] Signature mismatch — possible tamper attempt');
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

        // ── Validate RFQ ownership ────────────────────────────────────────────────
        const db = getFirestore();
        const rfqSnap = await db.collection('rfqs').doc(rfqId).get();

        if (!rfqSnap.exists) {
            return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
        }

        const rfq = rfqSnap.data()!;
        if (rfq.userId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const paidAt = new Date().toISOString();

        // ── Update Firestore based on payment type ────────────────────────────────
        const updates: Record<string, any> = {
            [`paymentStatus.${paymentType}.paid`]: true,
            [`paymentStatus.${paymentType}.razorpayOrderId`]: razorpay_order_id,
            [`paymentStatus.${paymentType}.razorpayPaymentId`]: razorpay_payment_id,
            [`paymentStatus.${paymentType}.paidAt`]: paidAt,
            updatedAt: paidAt,
        };

        if (paymentType === 'advance') {
            // Advance paid → project moves to in_progress
            updates.status = 'in_progress';
        } else if (paymentType === 'completion') {
            // Completion paid → project fully completed
            updates.status = 'completed';
        }

        await db.collection('rfqs').doc(rfqId).update(updates);

        // Record payment in a separate payments collection for audit trail
        await db.collection('payments').add({
            rfqId,
            userId,
            paymentType,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            amount: rfq.finalPrice * 0.5,
            currency: 'INR',
            paidAt,
            createdAt: paidAt,
        });

        return NextResponse.json({ success: true, paymentType, paidAt });
    } catch (err: any) {
        console.error('[verify] Error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
