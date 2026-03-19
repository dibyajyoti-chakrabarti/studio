import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Result, ok, err } from '@/lib/result';
import { AppError, ErrorCode, internalError, notFoundError } from '@/lib/errors';
import { QuoteResult } from '@/types/quoting';
import { logger } from '@/lib/logger';

// ═══════════════════════════════════════════════════
// QuotesRepository — Firestore operations for Quotes
// ═══════════════════════════════════════════════════

const COLLECTION_NAME = 'quotes';

export const QuotesRepository = {
  /**
   * Saves a quote result to Firestore.
   */
  async saveQuote(quote: QuoteResult, userId?: string): Promise<Result<string, AppError>> {
    try {
      const quoteRef = doc(collection(db, COLLECTION_NAME), quote.quoteRef);
      
      const data = {
        ...quote,
        userId: userId || null,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromMillis(Date.now() + 15 * 60 * 1000), // 15 mins expiry
        status: 'active'
      };

      await setDoc(quoteRef, data);
      
      logger.info({ event: 'Quote saved to Firestore', quoteRef: quote.quoteRef, userId });
      return ok(quote.quoteRef);
    } catch (e) {
      logger.error({ event: 'Failed to save quote', error: e, quoteRef: quote.quoteRef });
      return err(internalError('Failed to save quote to database'));
    }
  },

  /**
   * Retrieves a quote by its reference ID.
   */
  async getQuoteByRef(ref: string): Promise<Result<QuoteResult & { userId: string | null }, AppError>> {
    try {
      const quoteDoc = await getDoc(doc(db, COLLECTION_NAME, ref));
      
      if (!quoteDoc.exists()) {
        return err(notFoundError('Quote', ref));
      }

      const data = quoteDoc.data();
      
      // Check for expiry (quotes valid for 15 mins as per UI)
      const now = Date.now();
      const expiresAt = data.expiresAt?.toMillis() || 0;
      
      if (expiresAt < now) {
        logger.warn({ event: 'Attempted to access expired quote', quoteRef: ref });
        // We still return it but the service might want to handle expiry
      }

      return ok(data as QuoteResult & { userId: string | null });
    } catch (e) {
      logger.error({ event: 'Failed to fetch quote', error: e, quoteRef: ref });
      return err(internalError('Failed to fetch quote from database'));
    }
  },

  /**
   * Retrieves all quotes for a specific user.
   */
  async getQuotesByUserId(userId: string): Promise<Result<QuoteResult[], AppError>> {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const quotes: QuoteResult[] = [];
      querySnapshot.forEach((doc) => {
        quotes.push(doc.data() as QuoteResult);
      });

      return ok(quotes);
    } catch (e) {
      logger.error({ event: 'Failed to fetch user quotes', error: e, userId });
      return err(internalError('Failed to fetch user quotes from database'));
    }
  }
};
