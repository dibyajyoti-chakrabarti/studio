import { 
  QuoteOrder, 
  ShippingAddress, 
  ShippingOption, 
  OrderStatus, 
  PaymentStatus 
} from '@/types/checkout';
import { QuoteResult, QuoteCartItem } from '@/types/quoting';
import { Result, ok, err } from '@/utils/result';
import { AppError, ErrorCode, internalError, validationError } from '@/utils/errors';
import { OrdersRepository } from '@/lib/firebase/repositories/orders';
import { QuotingService } from '@/services/quoting.service';
import { logger } from '@/utils/logger';
import { nanoid } from 'nanoid';
import { calculateProjectFinances } from '@/utils/finance';

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
    razorpayOrderId?: string,
    projectId?: string,
    advancePercentage?: number,
    isBalance?: boolean
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

      // 2. Calculate final totals
      const quoteSubtotal = cartItems.reduce((sum, item) => sum + item.quote.totalPrice, 0);
      const shopSubtotal = shopItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
      const subtotal = quoteSubtotal + shopSubtotal;
      
      const isAdvance = !!(projectId && advancePercentage && !isBalance);
      
      // Use unified finance logic for project-based orders
      const finances = calculateProjectFinances(subtotal);
      
      const gst = finances.gst;
      const shippingCost = finances.shipping;
      let finalTotal = finances.total;
      
      if (isAdvance) {
        // Amount for advance payment
        finalTotal = finances.advance;
      } else if (isBalance) {
        // Amount for final balance payment
        finalTotal = finances.balance;
      }

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
        total: finalTotal, // This is the amount to be paid via Razorpay
        status: 'quoted',
        paymentStatus: 'pending',
        razorpayOrderId,
        projectId,
        isAdvance,
        isBalance,
        advancePercentage,
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

      // If this is a project payment, update the project status
      if (order.projectId) {
        const { getFirebaseAdmin } = await import('@/lib/firebase-admin');
        const { adminFirestore } = getFirebaseAdmin();
        if (adminFirestore) {
          const updateData: any = {
            updatedAt: new Date().toISOString()
          };

          if (order.isAdvance) {
            updateData.status = 'in_production';
            updateData['paymentStatus.advance'] = {
              paid: true,
              paidAt: new Date().toISOString(),
              razorpayPaymentId,
              amount: order.total
            };
            logger.info({ event: 'Project status synced to in_production', projectId: order.projectId, orderId });
          } else if (order.isBalance) {
            updateData.status = 'delivered';
            updateData['paymentStatus.completion'] = {
              paid: true,
              paidAt: new Date().toISOString(),
              razorpayPaymentId,
              amount: order.total
            };
            logger.info({ event: 'Project status synced to delivered', projectId: order.projectId, orderId });
          }

          await adminFirestore.collection('projectRFQs').doc(order.projectId).update(updateData);
        }
      }
      
      return ok(undefined);
    } catch (e) {
      logger.error({ event: 'Failed to mark order as paid', error: e, orderId });
      return err(internalError('Failed to update payment status'));
    }
  }
};
