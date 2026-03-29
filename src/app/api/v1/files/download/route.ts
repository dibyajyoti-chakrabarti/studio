import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { getPresignedDownloadUrl } from '@/lib/s3-client';
import { logger } from '@/utils/logger';

/**
 * GET /api/v1/files/download?key=[fileKey]
 * Generates a presigned URL for downloading a file.
 * Requires a valid Firebase ID Token in the Authorization header.
 */
export async function GET(req: NextRequest) {
    const reqId = Math.random().toString(36).substring(7);
    
    try {
        const { searchParams } = new URL(req.url);
        const fileKey = searchParams.get('fileKey') || searchParams.get('key');

        if (!fileKey) {
            return NextResponse.json({ error: 'Missing fileKey parameter' }, { status: 400 });
        }

        const { adminAuth } = getFirebaseAdmin();
        if (!adminAuth) {
            return NextResponse.json({ error: 'Auth service unavailable' }, { status: 500 });
        }

        // 1. Verify Authentication
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        try {
            await adminAuth.verifyIdToken(idToken);
        } catch (authError) {
            logger.error({ event: 'API: Download Auth Failure', reqId, error: authError });
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        // 2. Generate Presigned URL
        // Intelligently select bucket based on fileKey prefix
        let bucket = process.env.AWS_S3_CAD_BUCKET || process.env.AWS_S3_BUCKET || "";
        if (fileKey.startsWith('rfq-designs/') && process.env.AWS_S3_BUCKET) {
            bucket = process.env.AWS_S3_BUCKET;
        }

        const downloadUrl = await getPresignedDownloadUrl(fileKey, bucket);

        logger.info({ event: 'API: Presigned download URL generated', fileKey, bucket, reqId });

        return NextResponse.json({ url: downloadUrl, downloadUrl }); // Return both for compatibility

    } catch (error: any) {
        logger.error({ event: 'API: Download error', reqId, error: error.message });
        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
