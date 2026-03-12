import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';
import { Transaction, DocumentSnapshot } from 'firebase-admin/firestore';

/**
 * Basic Firestore-based rate limiter for serverless environments.
 * Tracks requests per IP address or User ID within a given window.
 */
export async function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000) {
    const { adminFirestore } = getFirebaseAdmin();
    
    if (!adminFirestore) {
        console.warn("Firestore Admin not initialized, skipping rate limit");
        return { success: true, remaining: 999, reset: Date.now() };
    }

    const now = Date.now();
    const limitRef = adminFirestore.collection('rate_limits').doc(identifier);
    
    try {
        const result = await adminFirestore.runTransaction(async (transaction: Transaction) => {
            const doc = await transaction.get(limitRef) as DocumentSnapshot;
            const data: any = doc.data() || { requests: [], count: 0 };
            
            // Filter out old requests
            const validRequests = (data.requests || []).filter((timestamp: number) => timestamp > now - windowMs);
            
            if (validRequests.length >= limit) {
                return { success: false, remaining: 0, reset: (validRequests[0] || now) + windowMs };
            }
            
            const newRequests = [...validRequests, now];
            transaction.set(limitRef, {
                requests: newRequests,
                count: newRequests.length,
                updatedAt: new Date().toISOString()
            });
            
            return { success: true, remaining: limit - newRequests.length, reset: now + windowMs };
        });
        
        return result;
    } catch (error) {
        console.error("Rate limit error:", error);
        // Fallback to allow if transaction fails to avoid blocking users
        return { success: true, remaining: 1, reset: now + windowMs };
    }
}

export function rateLimitResponse(reset: number) {
    return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
            status: 429,
            headers: {
                'X-RateLimit-Reset': reset.toString(),
                'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString()
            }
        }
    );
}
