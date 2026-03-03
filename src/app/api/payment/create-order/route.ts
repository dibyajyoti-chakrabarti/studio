import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

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

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { rfqId, paymentType, userId } = await req.json() as {
            rfqId: string;
            paymentType: 'advance' | 'completion';
            userId: string;
        };

        if (!rfqId || !paymentType || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // ── Fetch & validate the RFQ ─────────────────────────────────────────────
        const db = getFirestore();
        const rfqSnap = await db.collection('rfqs').doc(rfqId).get();

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

        if (paymentType === 'completion' && rfq.status !== 'shipping') {
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

        // 50% in paise (Razorpay requires smallest currency unit)
        const amountPaise = Math.round(finalPrice * 0.5 * 100);

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
        await db.collection('rfqs').doc(rfqId).update({
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
        console.error('[create-order] Error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
