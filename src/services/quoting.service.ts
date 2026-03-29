import { 
  QuoteRequest, 
  QuoteResult, 
  ParsedGeometry 
} from '@/types/quoting';
import { Result, ok, err } from '@/utils/result';
import { AppError, ErrorCode, internalError } from '@/utils/errors';
import { generateQuote } from '@/lib/quoting/pricing-engine';
import { QuotesRepository } from '@/lib/firebase/repositories/quotes';
import { logger } from '@/utils/logger';

// ═══════════════════════════════════════════════════
// QuotingService — Orchestrates the quoting process
// ═══════════════════════════════════════════════════

export const QuotingService = {
  /**
   * Processes a quote request:
   * 1. Calculates pricing using engine
   * 2. Runs DFM checks
   * 3. Persists the result to Firestore
   * 4. Returns the final QuoteResult
   */
  async processQuoteRequest(
    request: QuoteRequest, 
    userId?: string
  ): Promise<Result<QuoteResult, AppError>> {
    logger.info({ 
      event: 'Processing quote request',
      materialId: request.materialId, 
      quantity: request.quantity,
      userId 
    });

    try {
      // 1. Generate the quote result (Logic in pricing-engine handles DFM + Pricing)
      const quoteResult = generateQuote(
        request.materialId,
        request.thicknessMm,
        request.finishType,
        request.quantity,
        request.turnaround,
        request.geometry
      );

      if (!quoteResult.success) {
        return err(quoteResult.error);
      }

      const resultData = quoteResult.data;

      // 2. Persist to Firestore for retrieval during checkout
      const saveResult = await QuotesRepository.saveQuote(resultData, userId);
      
      if (!saveResult.success) {
        return err(saveResult.error);
      }

      logger.info({ 
        event: 'Quote processed and saved successfully',
        quoteRef: resultData.quoteRef,
        totalPrice: resultData.totalPrice 
      });

      return ok(resultData);
    } catch (e) {
      logger.error({ event: 'Unexpected error in QuotingService', error: e, request });
      return err(internalError('An unexpected error occurred during quoting'));
    }
  },

  /**
   * Retrieves a previously generated quote.
   */
  async getQuote(ref: string): Promise<Result<QuoteResult, AppError>> {
    const result = await QuotesRepository.getQuoteByRef(ref);
    if (!result.success) return err(result.error);
    
    // We strip the userId before returning if it's sensitive, 
    // but for internal service use it's fine.
    return ok(result.data);
  }
};
