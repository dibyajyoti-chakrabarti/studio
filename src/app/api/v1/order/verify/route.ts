import { NextRequest } from 'next/server';
import { OrderController } from '@/controllers/order.controller';

/**
 * POST /api/v1/order/verify
 * Verifies Razorpay payment signature and marks order as paid.
 */
export async function POST(req: NextRequest) {
  return OrderController.verifyOrder(req);
}
