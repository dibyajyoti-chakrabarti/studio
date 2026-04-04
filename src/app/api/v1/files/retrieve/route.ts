import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { authenticateRequest, forbiddenResponse } from '@/lib/auth-middleware';
import { logger } from '@/utils/logger';
import { s3Client, S3_BUCKET } from '@/lib/s3-client';

/**
 * GET /api/v1/files/retrieve?fileKey=[key]
 * Proxy endpoint to retrieve private S3 files securely.
 * Bypasses client-side CORS issues by streaming from server-to-server.
 */
export async function GET(req: NextRequest) {
  const reqId = Math.random().toString(36).substring(7);

  try {
    // 1. Authenticate the request
    const auth = await authenticateRequest(req);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const fileKey = searchParams.get('fileKey');

    if (!fileKey) {
      return NextResponse.json({ error: 'Missing fileKey parameter' }, { status: 400 });
    }

    // 2. Select bucket (consistent with download API)
    let bucket = process.env.AWS_S3_CAD_BUCKET || process.env.AWS_S3_BUCKET || S3_BUCKET;
    if (fileKey.startsWith('rfq-designs/') && process.env.AWS_S3_BUCKET) {
      bucket = process.env.AWS_S3_BUCKET;
    }

    // 3. Fetch from S3
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });

    const s3Response = await s3Client.send(command);

    if (!s3Response.Body) {
      throw new Error('Empty body from S3');
    }

    // 4. Stream response to client
    // We treat the S3 body as a readable stream
    return new Response(s3Response.Body as ReadableStream, {
      headers: {
        'Content-Type': s3Response.ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': `attachment; filename="${fileKey.split('/').pop()}"`,
      },
    });

  } catch (error: any) {
    logger.error({ event: 'API: Retrieval error', reqId, error: error.message });
    return NextResponse.json(
      { error: 'Failed to retrieve file from storage' },
      { status: 500 }
    );
  }
}
