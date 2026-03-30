import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { getPresignedDownloadUrl } from '@/lib/s3-client';
import { logger } from '@/utils/logger';
import { authenticateRequest, forbiddenResponse } from '@/lib/auth-middleware';

/**
 * GET /api/v1/files/download?key=[fileKey]
 * Generates a presigned URL for downloading a file.
 * Requires a valid Firebase ID Token in the Authorization header.
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
    const fileKey = searchParams.get('fileKey') || searchParams.get('key');

    if (!fileKey) {
      return NextResponse.json({ error: 'Missing fileKey parameter' }, { status: 400 });
    }

    // 2. Verify file ownership by checking uploaded_files collection
    const { adminFirestore } = getFirebaseAdmin();
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 });
    }

    // Try to find the file by key in uploaded_files collection
    const filesSnapshot = await adminFirestore.collection('uploaded_files')
      .where('fileKey', '==', fileKey)
      .limit(1)
      .get();

    if (!filesSnapshot.empty) {
      const fileData = filesSnapshot.docs[0].data();
      // If file has a userId, verify ownership
      if (fileData.userId && fileData.userId !== auth.uid) {
        logger.warn({ event: 'API: Unauthorized file download attempt', fileKey, authUid: auth.uid, fileOwner: fileData.userId });
        return forbiddenResponse('You do not have access to this file');
      }
    }

    // 3. Generate Presigned URL
    // Intelligently select bucket based on fileKey prefix
    let bucket = process.env.AWS_S3_CAD_BUCKET || process.env.AWS_S3_BUCKET || '';
    if (fileKey.startsWith('rfq-designs/') && process.env.AWS_S3_BUCKET) {
      bucket = process.env.AWS_S3_BUCKET;
    }

    const downloadUrl = await getPresignedDownloadUrl(fileKey, bucket);

    logger.info({ event: 'API: Presigned download URL generated', fileKey, bucket, reqId });

    return NextResponse.json({ url: downloadUrl, downloadUrl }); // Return both for compatibility
  } catch (error: any) {
    logger.error({ event: 'API: Download error', reqId, error: error.message });
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
