// ═══════════════════════════════════════════════════
// Centralized Config — NEVER hardcode configuration values
// All config reads from environment variables
// ═══════════════════════════════════════════════════

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  env: requireEnv('NODE_ENV', 'development'),
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',

  firebase: {
    projectId: requireEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'studio-874395008-ab6df'),
    apiKey: requireEnv('NEXT_PUBLIC_FIREBASE_API_KEY', ''),
    authDomain: requireEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', ''),
  },

  s3: {
    bucket: requireEnv('AWS_S3_BUCKET', 'mechhub-uploads'),
    region: requireEnv('AWS_S3_REGION', 'ap-south-1'),
    accessKeyId: requireEnv('AWS_ACCESS_KEY_ID', ''),
    secretAccessKey: requireEnv('AWS_SECRET_ACCESS_KEY', ''),
    presignedUrlTtlSeconds: 900, // 15 minutes
  },

  razorpay: {
    keyId: requireEnv('RAZORPAY_KEY_ID', ''),
    keySecret: requireEnv('RAZORPAY_KEY_SECRET', ''),
  },

  quoting: {
    cacheQuoteTtlSeconds: 900, // 15 minutes
    cacheMaterialsTtlSeconds: 3600, // 1 hour
    minOrderPriceInr: 2900, // ₹29 in paise
    targetMargin: 0.42, // 42% gross margin
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxUploadFilesPerSession: 10,
    quoteLockMinutes: 30,
  },

  rateLimit: {
    uploadsPerHourGuest: 10,
    uploadsPerHourAuth: 100,
    quotesPerMinute: 60,
  },
} as const;
