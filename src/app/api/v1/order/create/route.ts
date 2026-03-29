import { NextRequest } from 'next/server';
import { OrderController } from '@/controllers/order.controller';

/**
 * POST /api/v1/order/create
 * Creates a new order from a list of quoted items.
 */
export async function POST(req: NextRequest) {
  return OrderController.createOrder(req);
}
