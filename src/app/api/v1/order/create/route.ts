import { NextRequest, NextResponse } from 'next/server';
import { CheckoutService } from '@/services/checkout-service';
import { checkoutSchema } from '@/lib/validation/checkout';
import { logger } from '@/lib/logger';
import { ErrorCode } from '@/lib/errors';
import { SHIPPING_OPTIONS } from '@/types/checkout';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * POST /api/v1/order/create
 * Creates a new order from a list of quoted items.
 */
export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || 'req_internal';

  try {
    const body = await req.json();
    logger.info({ event: 'Order creation request received', requestId, body });

    // 1. Validation
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      logger.warn({ 
        event: 'Order validation failed', 
        requestId, 
        errors: validation.error.flatten() 
      });
      const firstError = validation.error.errors[0]?.message || 'Invalid order data';
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: ErrorCode.VALIDATION_FAILED, 
            message: firstError, 
            details: validation.error.flatten() 
          } 
        },
        { status: 400 }
      );
    }

    const { items, shopItems, shippingAddress, shippingOptionId, userId, projectId, isAdvance, isBalance, advancePercentage } = validation.data;

    // 2. Resolve shipping option
    const shippingOption = SHIPPING_OPTIONS.find(o => o.id === shippingOptionId);
    if (!shippingOption) {
      return NextResponse.json(
        { 
          success: false, 
          error: { code: ErrorCode.NOT_FOUND, message: 'Invalid shipping option' } 
        },
        { status: 400 }
      );
    }

    // 3. Create Razorpay Order
    const quoteSubtotal = (items || []).reduce((sum: number, item: any) => sum + item.quote.totalPrice, 0);
    const shopSubtotal = (shopItems || []).reduce((sum: number, item: any) => sum + (item.salePrice * item.quantity), 0);
    const subtotal = quoteSubtotal + shopSubtotal;
    
    const gst = Math.round(subtotal * 0.18);
    let finalTotal = subtotal + gst + shippingOption.price;
    
    // Apply advance percentage if provided
    if (projectId && advancePercentage) {
      finalTotal = Math.round(finalTotal * advancePercentage);
    }

    const amountPaise = Math.round(finalTotal * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `quote_${Date.now()}`,
      notes: {
        userId,
        type: isBalance ? 'project_balance' : (projectId ? 'project_advance' : 'quote_order'),
        projectId: projectId || ''
      }
    });

    // 4. Create Order via Service (Business Logic)
    const result = await CheckoutService.createOrder(
      userId,
      items as any,
      shopItems as any,
      shippingAddress as any,
      shippingOption,
      razorpayOrder.id,
      projectId,
      advancePercentage,
      isBalance
    );

    if (!result.success) {
      const error = result.error;
      logger.error({ event: 'Order creation service failed', requestId, error });
      return NextResponse.json(
        { success: false, error: { code: error.code, message: error.message } },
        { status: error.statusCode }
      );
    }

    // 4. Return Success
    logger.info({ 
      event: 'Order API success', 
      requestId, 
      orderId: result.data.id,
      total: result.data.total 
    });

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 201 }
    );

  } catch (e) {
    logger.error({ event: 'Order API crash', requestId, error: e });
    return NextResponse.json(
      { 
        success: false, 
        error: { code: ErrorCode.INTERNAL_ERROR, message: 'Failed to process order' } 
      },
      { status: 500 }
    );
  }
}
