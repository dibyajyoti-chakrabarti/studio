import { db } from '@/firebase/config';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { Result, ok, err } from '@/utils/result';
import { AppError, internalError, notFoundError } from '@/utils/errors';
import { QuoteOrder } from '@/types/checkout';
import { logger } from '@/utils/logger';
import { serverTimestamp as clientServerTimestamp } from 'firebase/firestore'; // For client-side if needed

// ═══════════════════════════════════════════════════
// OrdersRepository — Firestore operations for Orders
// ═══════════════════════════════════════════════════

const COLLECTION_NAME = 'orders';

export const OrdersRepository = {
  /**
   * Saves a new order to Firestore.
   */
  async saveOrder(order: QuoteOrder): Promise<Result<string, AppError>> {
    try {
      const { adminFirestore } = getFirebaseAdmin();

      // Clean undefined properties (Firestore Admin doesn't like undefined)
      // We use JSON stringify/parse for a quick deep clean of plain objects
      const data = JSON.parse(JSON.stringify(order));
      data.createdAt = new Date().toISOString();

      if (adminFirestore) {
        const orderRef = adminFirestore.collection(COLLECTION_NAME).doc(order.id);
        await orderRef.set(data);

        logger.info({
          event: 'Order saved via Firebase Admin',
          orderId: order.id,
          userId: order.userId
        });
        return ok(order.id);
      } else {
        // Fallback to client SDK
        const { setDoc, doc, collection, serverTimestamp } = await import('firebase/firestore');
        const orderRef = doc(collection(db, COLLECTION_NAME), order.id);

        // Note: serverTimestamp() only works with the Client SDK
        await setDoc(orderRef, { ...data, createdAt: serverTimestamp() });

        logger.info({ event: 'Order saved via Client SDK', orderId: order.id });
        return ok(order.id);
      }
    } catch (e: any) {
      const errorMessage = e.message || 'Unknown Firestore error';
      logger.error({
        event: 'Failed to save order to Firestore',
        error: {
          message: errorMessage,
          code: e.code,
          stack: e.stack
        },
        orderId: order.id
      });
      // Pass the real error message through for easier debugging
      return err(internalError(`Database Error: ${errorMessage}`));
    }
  },

  /**
   * Retrieves an order by its ID.
   */
  async getOrderById(id: string): Promise<Result<QuoteOrder, AppError>> {
    try {
      const { adminFirestore } = getFirebaseAdmin();
      if (!adminFirestore) {
        return err(internalError('Firebase Admin not initialized'));
      }

      const orderDoc = await adminFirestore.collection(COLLECTION_NAME).doc(id).get();

      if (!orderDoc.exists) {
        return err(notFoundError('Order', id));
      }

      return ok(orderDoc.data() as QuoteOrder);
    } catch (e) {
      logger.error({ event: 'Failed to fetch order', error: e, orderId: id });
      return err(internalError('Failed to fetch order from database'));
    }
  },

  /**
   * Retrieves all orders for a specific user.
   */
  async getOrdersByUserId(userId: string): Promise<Result<QuoteOrder[], AppError>> {
    try {
      const { adminFirestore } = getFirebaseAdmin();
      if (!adminFirestore) {
        return err(internalError('Firebase Admin not initialized'));
      }

      const q = adminFirestore.collection(COLLECTION_NAME).where('userId', '==', userId);
      const querySnapshot = await q.get();

      const orders: QuoteOrder[] = [];
      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as QuoteOrder);
      });

      return ok(orders);
    } catch (e) {
      logger.error({ event: 'Failed to fetch user orders', error: e, userId });
      return err(internalError('Failed to fetch user orders from database'));
    }
  }
};
