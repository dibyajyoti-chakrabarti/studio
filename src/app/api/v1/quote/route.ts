import { NextResponse } from 'next/server';
import { QuotingService } from '@/services/quoting-service';
import { quoteRequestSchema } from '@/lib/validation/quoting';
import { logger } from '@/lib/logger';
import { isOk } from '@/lib/result';
import { AppError, ErrorCode } from '@/lib/errors';

// ═══════════════════════════════════════════════════
// POST /api/v1/quote — Generate and Save Instant Quote
// ═══════════════════════════════════════════════════

export async function POST(request: Request) {
  const reqId = Math.random().toString(36).substring(7);
  logger.info({ event: 'API: POST /api/v1/quote started', reqId });

  try {
    const body = await request.json();
    
    // 1. Validate Input
    const validation = quoteRequestSchema.safeParse(body);
    if (!validation.success) {
      logger.warn({ 
        event: 'API: Quote request validation failed',
        reqId, 
        errors: validation.error.format() 
      });
      return NextResponse.json({ 
        error: 'Invalid quote request', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    // 2. Process Quote via Service
    // Note: In a real app, we'd extract userId from session here.
    // For MVP, we allow unauthenticated instant quotes.
    const result = await QuotingService.processQuoteRequest(validation.data);

    if (result.success) {
      logger.info({ 
        event: 'API: Quote generated successfully',
        reqId, 
        quoteRef: result.data.quoteRef 
      });
      return NextResponse.json(result.data);
    } else {
      const error = result.error;
      logger.error({ 
        event: 'API: Quote generation failed',
        reqId, 
        code: error.code, 
        message: error.message 
      });
      return NextResponse.json({ 
        error: error.message, 
        code: error.code 
      }, { status: error.code === ErrorCode.VALIDATION_FAILED ? 400 : 500 });
    }
  } catch (e) {
    logger.error({ event: 'API: Unexpected error in quote route', reqId, error: e });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
