import { QuoteController } from '@/controllers/quote.controller';

/**
 * POST /api/v1/quote — Generate and Save Instant Quote
 */
export async function POST(request: Request) {
  return QuoteController.createQuote(request);
}
