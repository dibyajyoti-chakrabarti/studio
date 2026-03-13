import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { MediaService } from '@/lib/services/media-service';

/**
 * PRODUCTION-GRADE IMAGE UPLOAD API (v1)
 * Handles multi-size processing, SEO naming, and Firestore indexing via MediaService
 */
export async function POST(req: NextRequest) {
    try {
        const { adminAuth, adminFirestore } = getFirebaseAdmin();
        
        if (!adminAuth || !adminFirestore) {
            return NextResponse.json({ error: 'Firebase services not initialized' }, { status: 500 });
        }

        // 1. Authorize Admin
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userDoc = await adminFirestore.collection('users').doc(decodedToken.uid).get();
        if (userDoc.data()?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Parse Payload
        let formData;
        try {
            formData = await req.formData();
        } catch (e) {
            return NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 });
        }

        const file = formData.get('file') as File;
        const productId = formData.get('productId') as string;
        const productName = formData.get('productName') as string;
        const sku = formData.get('sku') as string;
        const type = formData.get('type') as string || 'main';

        if (!file || !productId || !productName || !sku) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 3. Process via MediaService
        const mediaService = new MediaService(adminFirestore);
        const result = await mediaService.processAndUploadProductImage(buffer, {
            productId,
            productName,
            sku,
            type
        });

        return NextResponse.json({
            success: true,
            image: result
        });

    } catch (error: any) {
        console.error('[Upload API] Critical Failure:', {
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json({ 
            error: error.message || 'Internal Server Error' 
        }, { status: 500 });
    }
}
