import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { CheckoutService } from '@/services/checkout-service';
import { logger } from '@/lib/logger';
import { ErrorCode } from '@/lib/errors';

/**
 * POST /api/v1/order/verify
 * Verifies Razorpay payment signature and marks order as paid.
 */
export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || 'req_verify_quote';

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // Firestore Order ID
      userId
    } = await req.json() as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      orderId: string;
      userId: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId || !userId) {
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.VALIDATION_FAILED, message: 'Missing verification fields' } },
        { status: 400 }
      );
    }

    // 1. Verify HMAC-SHA256 signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      logger.warn({ event: 'Quote payment signature mismatch', requestId, orderId });
      return NextResponse.json(
        { success: false, error: { code: ErrorCode.VALIDATION_FAILED, message: 'Invalid payment signature' } },
        { status: 400 }
      );
    }

    // 2. Mark order as paid via service
    const result = await CheckoutService.markAsPaid(orderId, razorpay_payment_id);

    if (!result.success) {
      const error = result.error;
      logger.error({ event: 'Failed to mark quote order as paid', requestId, orderId, error });
      return NextResponse.json(
        { success: false, error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }

    logger.info({ event: 'Quote payment verified successfully', requestId, orderId });

    return NextResponse.json({ success: true, orderId });

  } catch (err: any) {
    logger.error({ event: 'Quote verification API crash', requestId, error: err });
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INTERNAL_ERROR, message: 'Verification failed' } },
      { status: 500 }
    );
  }
}
