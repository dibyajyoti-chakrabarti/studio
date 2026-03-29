import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { calculateProjectFinances } from '@/utils/finance';

// ── Firebase Admin init (reuse if already initialised) ─────────────────────
// Firebase Admin is handled by getFirebaseAdmin() central logic

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    let currentRfqId = 'unknown';
    try {
        const { rfqId, paymentType, userId } = await req.json() as {
            rfqId: string;
            paymentType: 'advance' | 'completion';
            userId: string;
        };
        currentRfqId = rfqId;

        if (!rfqId || !paymentType || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // ── Fetch & validate the RFQ ─────────────────────────────────────────────
        const { adminFirestore: db } = getFirebaseAdmin();
        if (!db) throw new Error('Firebase Admin not initialized');
        const rfqSnap = await db.collection('projectRFQs').doc(rfqId).get();

        if (!rfqSnap.exists) {
            return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
        }

        const rfq = rfqSnap.data()!;

        // Security: ensure the requester owns this RFQ
        if (rfq.userId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Validate correct status for each payment type
        if (paymentType === 'advance' && rfq.status !== 'accepted') {
            return NextResponse.json({ error: 'Advance payment only available after order is accepted' }, { status: 400 });
        }

        if (paymentType === 'completion' && rfq.status !== 'shipped' && rfq.status !== 'delivered' && rfq.status !== 'shipping') {
            return NextResponse.json({ error: 'Completion payment only available after order is shipped' }, { status: 400 });
        }

        // Prevent double payment
        if (paymentType === 'advance' && rfq.paymentStatus?.advance?.paid) {
            return NextResponse.json({ error: 'Advance already paid' }, { status: 400 });
        }

        if (paymentType === 'completion' && rfq.paymentStatus?.completion?.paid) {
            return NextResponse.json({ error: 'Completion already paid' }, { status: 400 });
        }

        const finalPrice: number = rfq.finalPrice || 0;
        if (finalPrice <= 0) {
            return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
        }

        const finances = calculateProjectFinances(finalPrice);
        const amount = paymentType === 'advance' ? finances.advance : finances.balance;
        
        // Final amount in paise (Razorpay requires smallest currency unit)
        const amountPaise = Math.round(amount * 100);

        // ── Create Razorpay order ─────────────────────────────────────────────────
        const order = await razorpay.orders.create({
            amount: amountPaise,
            currency: 'INR',
            receipt: `${rfqId}_${paymentType}`,
            notes: {
                rfqId,
                paymentType,
                userId,
                projectName: rfq.projectName || 'MechHub Order',
            },
        });

        // Store the pending Razorpay order ID in Firestore for later verification
        await db.collection('projectRFQs').doc(rfqId).update({
            [`paymentStatus.${paymentType}.razorpayOrderId`]: order.id,
            [`paymentStatus.${paymentType}.paid`]: false,
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({
            orderId: order.id,
            amount: amountPaise,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID,
            projectName: rfq.projectName || 'MechHub Order',
            customerEmail: rfq.contactEmail || '',
            customerName: rfq.contactName || '',
            customerPhone: rfq.contactPhone || '',
        });
    } catch (err: any) {
        logger.error({
            event: 'payment_order_creation_failed',
            error: err.message,
            rfqId: currentRfqId
        });
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
