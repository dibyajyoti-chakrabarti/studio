import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { items, shippingAddress, userId } = await req.json() as {
            items: any[];
            shippingAddress: any;
            userId: string;
        };

        if (!items || !items.length || !shippingAddress || !userId) {
            return NextResponse.json({ error: 'Missing required checkout fields' }, { status: 400 });
        }

        const { adminFirestore: db } = getFirebaseAdmin();
        if (!db) throw new Error('Firebase Admin not initialized');

        // 1. Re-calculate and validate on backend (Security & Inventory Check)
        let subtotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const productSnap = await db.collection('products').doc(item.id).get();
            if (!productSnap.exists) {
                return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 404 });
            }

            const product = productSnap.data()!;

            // Check Inventory
            if (product.inventory < item.quantity) {
                return NextResponse.json({
                    error: `Insufficient stock for ${product.name}. Available: ${product.inventory}`
                }, { status: 400 });
            }

            const price = product.salePrice || 0;
            subtotal += price * item.quantity;

            validatedItems.push({
                id: item.id,
                name: product.name,
                sku: product.sku,
                quantity: item.quantity,
                price: price
            });
        }

        const gst = Math.round(subtotal * 0.18);
        const shipping = 0; // Integrated into product pricing
        const finalTotal = subtotal + gst + shipping;

        // 2. Create Razorpay Order
        const amountPaise = Math.round(finalTotal * 100);
        const razorpayOrder = await razorpay.orders.create({
            amount: amountPaise,
            currency: 'INR',
            receipt: `shop_${Date.now()}`,
            notes: {
                userId,
                type: 'shop_order'
            }
        });

        // 3. Create Pending Order in Firestore
        const orderRef = await db.collection('orders').add({
            userId,
            items: validatedItems,
            pricing: {
                subtotal,
                gst,
                shipping,
                total: finalTotal
            },
            shippingAddress,
            status: 'pending',
            paymentStatus: 'unpaid',
            razorpayOrderId: razorpayOrder.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({
            orderId: razorpayOrder.id,
            shopOrderId: orderRef.id,
            amount: amountPaise,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (err: any) {
        console.error('[shop-checkout] Error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
