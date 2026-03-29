import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ═══════════════════════════════════════════════════
// AWS S3 Client — Singleton for use in API routes
// ═══════════════════════════════════════════════════

export const S3_REGION = process.env.AWS_REGION || 'eu-north-1';
export const S3_BUCKET =
  process.env.AWS_S3_CAD_BUCKET || process.env.AWS_S3_BUCKET || 'mechhub-cad-files';

export const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Generates a presigned URL for downloading a file from S3.
 * @param key The S3 object key
 * @param bucket Optional bucket name (defaults to S3_BUCKET)
 * @param expiresIn Time in seconds until the URL expires (default: 3600 / 1 hour)
 */
export async function getPresignedDownloadUrl(
  key: string,
  bucket: string = S3_BUCKET,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}
