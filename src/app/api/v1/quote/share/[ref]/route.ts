import { NextResponse } from 'next/server';
import { QuotingService } from '@/services/quoting-service';
import { logger } from '@/lib/logger';
import { isOk } from '@/lib/result';

// ═══════════════════════════════════════════════════
// GET /api/v1/quote/share/[ref] — Retrieve Shared Quote
// ═══════════════════════════════════════════════════

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  logger.info({ event: 'API: GET /api/v1/quote/share started', ref });

  try {
    const result = await QuotingService.getQuote(ref);

    if (result.success) {
      // Check for expiry (quotes valid for 15 mins)
      // Logic inside service handles retrieval, but we can do extra checks here.
      logger.info({ event: 'API: Shared quote retrieved', ref });
      return NextResponse.json(result.data);
    } else {
      logger.warn({ event: 'API: Shared quote not found or error', ref, error: result.error });
      return NextResponse.json({ 
        error: 'Quote not found or has expired', 
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }
  } catch (e) {
    logger.error({ event: 'API: Unexpected error in share quote route', ref, error: e });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
