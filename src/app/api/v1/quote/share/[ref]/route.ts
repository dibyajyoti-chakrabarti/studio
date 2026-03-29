import { QuoteController } from '@/controllers/quote.controller';

/**
 * GET /api/v1/quote/share/[ref] — Retrieve Shared Quote
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  return QuoteController.getSharedQuote(ref);
}
