/**
 * Payment Verification API  —  POST /api/v1/payment/verify
 *
 * WHAT THIS DOES:
 * After a customer successfully pays through the Razorpay popup, Razorpay
 * sends back a signature. This API verifies that signature to confirm the
 * payment is genuine (not tampered with), then updates the project status.
 *
 * WHY VERIFICATION IS NEEDED:
 * Anyone could fake a "payment successful" response on the frontend.
 * The HMAC signature check ensures the payment actually went through Razorpay.
 * Think of it like a wax seal on a letter — only Razorpay can create it,
 * and we can verify it using our secret key.
 *
 * FLOW:
 * 1. Customer pays via Razorpay popup (handled by create-order API)
 * 2. Razorpay sends { order_id, payment_id, signature } back to the frontend
 * 3. Frontend forwards those to this API
 * 4. This API verifies the signature using HMAC-SHA256
 * 5. If valid → marks payment as "paid" and updates project status
 * 6. Also creates an audit record in the "payments" collection
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto'; // Node.js built-in module for cryptographic operations
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';

/**
 * Handles POST requests to verify a completed Razorpay payment.
 *
 * @param req - The incoming HTTP request containing Razorpay's response data:
 *   - razorpay_order_id: The order ID we created in create-order
 *   - razorpay_payment_id: Razorpay's unique ID for this payment
 *   - razorpay_signature: HMAC signature to prove payment is genuine
 *   - rfqId: Our project's Firestore document ID
 *   - paymentType: 'advance' or 'completion'
 *   - userId: The Firebase Auth UID of the paying customer
 */
export async function POST(req: NextRequest) {
  // Track the order ID for error logging
  let razorpayOrderId = 'unknown';

  try {
    // ── Step 1: Parse the request body ───────────────────────────────────
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      rfqId,
      paymentType,
      userId,
    } = (await req.json()) as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      rfqId: string;
      paymentType: 'advance' | 'completion';
      userId: string;
    };
    razorpayOrderId = razorpay_order_id;

    // Make sure nothing is missing
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !rfqId ||
      !paymentType ||
      !userId
    ) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // ── Step 2: Verify the HMAC-SHA256 signature ─────────────────────────
    // HOW THIS WORKS:
    // Razorpay creates a signature by hashing "order_id|payment_id" with our
    // secret key. We do the same calculation and compare. If they match,
    // the payment is genuine. If not, someone is trying to fake it.
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!) // Use our secret key
      .update(body) // Hash the "order_id|payment_id" string
      .digest('hex'); // Convert to hexadecimal string

    // Compare our calculated signature with what Razorpay sent
    if (expectedSignature !== razorpay_signature) {
      // Signature mismatch = potential fraud or data tampering
      logger.warn({
        event: 'payment_signature_mismatch',
        orderId: razorpay_order_id,
        userId,
      });
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // ── Step 3: Verify that this user actually owns the project ──────────
    const { adminFirestore: db } = getFirebaseAdmin();
    if (!db) throw new Error('Firebase Admin not initialized');

    const rfqSnap = await db.collection('projectRFQs').doc(rfqId).get();

    if (!rfqSnap.exists) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
    }

    const rfq = rfqSnap.data()!;

    // Security: make sure the person verifying the payment is the project owner
    if (rfq.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Record the exact time of payment for receipts and audit trail
    const paidAt = new Date().toISOString();

    // ── Step 4: Update the project in Firestore ──────────────────────────
    // Build a dynamic update object based on whether this is advance or completion
    const updates: Record<string, any> = {
      // Mark this payment milestone as paid and store Razorpay references
      [`paymentStatus.${paymentType}.paid`]: true,
      [`paymentStatus.${paymentType}.razorpayOrderId`]: razorpay_order_id,
      [`paymentStatus.${paymentType}.razorpayPaymentId`]: razorpay_payment_id,
      [`paymentStatus.${paymentType}.paidAt`]: paidAt,
      updatedAt: paidAt,
    };

    // Also update the overall project status based on which payment was made
    if (paymentType === 'advance') {
      // Advance paid → manufacturing can begin
      updates.status = 'in_progress';
    } else if (paymentType === 'completion') {
      // Final payment → order is fully complete
      updates.status = 'completed';
    }

    // Apply all updates to the project document in one batch
    await db.collection('projectRFQs').doc(rfqId).update(updates);

    // ── Step 5: Create an audit record in the "payments" collection ──────
    // This is a separate record for accounting and debugging purposes.
    // Even if the project document gets modified later, this payment
    // record stays as proof of what was paid and when.
    await db.collection('payments').add({
      rfqId,
      userId,
      paymentType,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: rfq.finalPrice * 0.5, // Each milestone is 50% of the final price
      currency: 'INR',
      paidAt,
      createdAt: paidAt,
    });

    // ── Step 6: Return success ───────────────────────────────────────────
    return NextResponse.json({ success: true, paymentType, paidAt });
  } catch (err: any) {
    // ── Error handling ───────────────────────────────────────────────────
    logger.error({
      event: 'payment_verification_error',
      error: err.message,
      orderId: razorpayOrderId,
    });
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
