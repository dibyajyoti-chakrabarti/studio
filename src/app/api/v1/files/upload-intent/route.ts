import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { nanoid } from 'nanoid';
import { s3Client } from '@/lib/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { authenticateRequest } from '@/lib/auth-middleware';

// ═══════════════════════════════════════════════════
// POST /api/v1/files/upload-intent — Real S3 Presigned URL
// ═══════════════════════════════════════════════════

export async function POST(request: Request) {
  const reqId = nanoid(8);
  logger.info({ event: 'API: POST /api/v1/files/upload-intent started', reqId });

  try {
    // 1. Authenticate the request
    const auth = await authenticateRequest(request as any);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { fileName, fileSize, contentType } = await request.json();

    if (!fileName || !fileSize) {
      return NextResponse.json({ error: 'Missing file metadata' }, { status: 400 });
    }

    // 2. Validate file extension (Security Check)
    const allowedExtensions = ['.dxf', '.step', '.stp', '.stl'];
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      logger.warn({ event: 'API: Invalid file extension rejected', fileName, reqId });
      return NextResponse.json({ error: `File type ${ext} not allowed` }, { status: 400 });
    }

    // 3. Generate unique S3 key
    const fileId = `file_${nanoid(12)}`;
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `cad-files/${nanoid(8)}/${sanitizedName}`;
    const bucket =
      process.env.AWS_S3_CAD_BUCKET || process.env.AWS_S3_BUCKET || 'mechhub-cad-files';

    // 4. Create Presigned PUT URL
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType || 'application/octet-stream',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 mins

    logger.info({ event: 'API: Real S3 upload intent generated', fileId, key, reqId });

    return NextResponse.json({
      fileId,
      uploadUrl,
      fileKey: key,
      bucket,
      fields: {
        'Content-Type': contentType || 'application/octet-stream',
        Key: key,
      },
    });
  } catch (e) {
    logger.error({ event: 'API: Unexpected error in upload-intent route', reqId, error: e });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
