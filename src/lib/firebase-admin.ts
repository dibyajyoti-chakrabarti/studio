import * as admin from 'firebase-admin';

export function getFirebaseAdmin() {
    if (!admin.apps.length) {
        try {
            if (
                process.env.FIREBASE_PROJECT_ID &&
                process.env.FIREBASE_CLIENT_EMAIL &&
                process.env.FIREBASE_PRIVATE_KEY
            ) {
                let privateKey = process.env.FIREBASE_PRIVATE_KEY;

                // If user accidentally pasted the whole JSON file into the PRIVATE_KEY env var
                if (privateKey.startsWith('{')) {
                    try {
                        const parsed = JSON.parse(privateKey);
                        if (parsed.private_key) {
                            privateKey = parsed.private_key;
                        }
                    } catch (e) {
                        console.error("Failed to parse FIREBASE_PRIVATE_KEY as JSON, continuing anyway.");
                    }
                }

                // Remove wrapping quotes often added by Vercel copy-pasting
                privateKey = privateKey.replace(/^["']|["']$/g, '');

                // Aggressive PEM Normalization to fix "DECODER routines" errors
                const beginStr = '-----BEGIN PRIVATE KEY-----';
                const endStr = '-----END PRIVATE KEY-----';

                if (privateKey.includes(beginStr) && privateKey.includes(endStr)) {
                    let base64Part = privateKey.substring(
                        privateKey.indexOf(beginStr) + beginStr.length,
                        privateKey.indexOf(endStr)
                    );

                    // Remove all whitespace, literal \n, etc.
                    base64Part = base64Part.replace(/\s+/g, '').replace(/\\n/g, '');

                    // Re-chunk into 64-character lines (standard PEM format)
                    const chunks = base64Part.match(/.{1,64}/g) || [];
                    privateKey = `${beginStr}\n${chunks.join('\n')}\n${endStr}\n`;
                } else {
                    // Fallback
                    privateKey = privateKey.replace(/\\n/g, '\n');
                }

                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: privateKey,
                    }),
                });
                console.log('Firebase Admin initialized successfully');
            } else {
                console.warn('Firebase Admin skipped: Missing env vars');
            }
        } catch (error) {
            console.error('Firebase Admin initialization error', error);
        }
    }

    return {
        adminAuth: admin.apps.length > 0 ? admin.auth() : null,
        adminFirestore: admin.apps.length > 0 ? admin.firestore() : null,
    };
}
