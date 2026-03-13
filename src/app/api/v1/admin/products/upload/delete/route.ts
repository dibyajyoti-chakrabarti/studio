import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { MediaService } from '@/lib/services/media-service';

/**
 * PRODUCTION-GRADE IMAGE DELETION API (v1)
 * Atomic removal of all size variants from Storage and record from Firestore
 */
export async function DELETE(req: NextRequest) {
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
        const { productId, imageId, urls } = await req.json();

        if (!productId || !imageId || !urls) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 3. Cleanup via MediaService
        const mediaService = new MediaService(adminFirestore);
        await mediaService.deleteProductImage(productId, imageId, urls);

        return NextResponse.json({
            success: true
        });

    } catch (error: any) {
        console.error('[Delete API] Critical Error:', error);
        return NextResponse.json({ 
            error: error.message || 'Internal Server Error' 
        }, { status: 500 });
    }
}
