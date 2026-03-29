import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars from .env.local at the very first line of execution
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testS3Upload() {
  console.log('--- Starting AWS S3 Diagnostic Upload Test ---');
  console.log('AWS Region:', process.env.AWS_REGION);
  console.log('S3 Bucket:', process.env.AWS_S3_BUCKET);

  // Dynamically import to ensure env vars are already in process.env
  const { getFirebaseAdmin } = await import('../src/lib/firebase-admin');
  const { MediaService } = await import('../src/services/media.service');

  const { adminFirestore } = getFirebaseAdmin();

  if (!adminFirestore) {
    console.error('Failed to initialize Firebase Admin (Firestore needed for metadata sync)');
    return;
  }

  // Get a real product ID to test the update logic
  const productSnap = await adminFirestore.collection('products').limit(1).get();
  if (productSnap.empty) {
    console.error('No products found in Firestore to test with');
    return;
  }
  const realProductId = productSnap.docs[0].id;
  const realProductName = productSnap.docs[0].data().name;
  const realSku = productSnap.docs[0].data().sku || 'TEST-SKU';

  console.log('Using real product for test:', { id: realProductId, name: realProductName });

  const mediaService = new MediaService(adminFirestore);
  // Valid 1x1 transparent WebP pixel
  const dummyBuffer = Buffer.from(
    'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtAAALAAA',
    'base64'
  );

  try {
    console.log('Attempting S3 upload and Firestore meta sync...');
    const result = await mediaService.processAndUploadProductImage(dummyBuffer, {
      productId: realProductId,
      productName: realProductName,
      sku: realSku,
      type: 'main',
    });
    console.log('S3 Upload & Meta Sync Success!', JSON.stringify(result, null, 2));
  } catch (err: any) {
    console.error('AWS S3 Upload Failed:', {
      message: err.message,
      code: err.code,
      requestId: err.$metadata?.requestId,
    });
  }
}

testS3Upload();
