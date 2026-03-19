import { 
  QuoteOrder, 
  ShippingAddress, 
  ShippingOption, 
  OrderStatus, 
  PaymentStatus 
} from '@/types/checkout';
import { QuoteResult, QuoteCartItem } from '@/types/quoting';
import { Result, ok, err } from '@/lib/result';
import { AppError, ErrorCode, internalError, validationError } from '@/lib/errors';
import { OrdersRepository } from '@/lib/firebase/repositories/orders';
import { QuotingService } from '@/services/quoting-service';
import { logger } from '@/lib/logger';
import { nanoid } from 'nanoid';

// ═══════════════════════════════════════════════════
// CheckoutService — Orchestrates the checkout process
// ═══════════════════════════════════════════════════

export const CheckoutService = {
  /**
   * Creates a multi-part order from a cart of quotes.
   */
  async createOrder(
    userId: string,
    cartItems: QuoteCartItem[],
    shopItems: any[],
    shippingAddress: ShippingAddress,
    shippingOption: ShippingOption,
    razorpayOrderId?: string
  ): Promise<Result<QuoteOrder, AppError>> {
    logger.info({ event: 'Creating multi-part order', userId, quoteCount: cartItems.length, shopCount: shopItems.length });

    try {
      // 1. Verify all quotes in the cart are still valid and have no blocking DFM
      for (const item of cartItems) {
        if (item.quote.hasBlockingIssues) {
          return err(validationError(`Part "${item.fileName}" has blocking DFM issues and cannot be ordered.`));
        }
        
        // In a real system, we would re-verify the quote from DB here to ensure they aren't expired.
        // For MVP, we trust the client-provided cart for now, but QuotingService.getQuote could be called.
      }

      // 2. Calculate final totals (GST is 18% in India)
      const quoteSubtotal = cartItems.reduce((sum, item) => sum + item.quote.totalPrice, 0);
      const shopSubtotal = shopItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
      const subtotal = quoteSubtotal + shopSubtotal;
      
      const gst = Math.round(subtotal * 0.18);
      const shippingCost = shippingOption.price;
      const total = subtotal + gst + shippingCost;

      const orderId = `order_${nanoid(12)}`;
      const orderNumber = `MH-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;

      const order: QuoteOrder = {
        id: orderId,
        orderNumber,
        userId,
        items: cartItems,
        shopItems,
        shippingAddress,
        shippingOption,
        subtotal,
        gst,
        shippingCost,
        total,
        status: 'quoted',
        paymentStatus: 'pending',
        razorpayOrderId,
        createdAt: new Date().toISOString(),
      };

      // 3. Persist the order
      const saveResult = await OrdersRepository.saveOrder(order);
      if (!saveResult.success) {
        return err(saveResult.error);
      }

      logger.info({ event: 'Multi-part order created successfully', orderId, orderNumber });

      return ok(order);
    } catch (e) {
      logger.error({ event: 'Unexpected error in CheckoutService.createOrder', error: e, userId });
      return err(internalError('An unexpected error occurred during order creation'));
    }
  },

  /**
   * Updates an order status after payment success.
   */
  async markAsPaid(orderId: string, razorpayPaymentId: string): Promise<Result<void, AppError>> {
    try {
      const orderResult = await OrdersRepository.getOrderById(orderId);
      if (!orderResult.success) return err(orderResult.error);

      const order = orderResult.data;
      const updatedOrder: QuoteOrder = {
        ...order,
        paymentStatus: 'paid',
        status: 'paid',
        razorpayPaymentId,
        paidAt: new Date().toISOString(),
      };

      await OrdersRepository.saveOrder(updatedOrder);
      logger.info({ event: 'Order marked as paid', orderId, razorpayPaymentId });
      
      return ok(undefined);
    } catch (e) {
      logger.error({ event: 'Failed to mark order as paid', error: e, orderId });
      return err(internalError('Failed to update payment status'));
    }
  }
};
