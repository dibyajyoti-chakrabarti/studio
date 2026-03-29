import { getFirebaseAdmin } from '../src/lib/firebase-admin';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

/**
 * MANAGE ADMINS SCRIPT
 * 
 * Usage:
 * npx tsx scripts/manage-admins.ts add <uid>
 * npx tsx scripts/manage-admins.ts remove <uid>
 * npx tsx scripts/manage-admins.ts check <uid>
 */

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];
  const uid = args[1];

  if (!action || !uid) {
    console.log('Usage: npx tsx scripts/manage-admins.ts <add|remove|check> <uid>');
    process.exit(1);
  }

  const { adminAuth } = getFirebaseAdmin();

  if (!adminAuth) {
    console.error('Failed to initialize Firebase Admin. Check your environment variables.');
    process.exit(1);
  }

  try {
    switch (action) {
      case 'add':
        await adminAuth.setCustomUserClaims(uid, { admin: true });
        console.log(`Successfully added admin claim to user: ${uid}`);
        break;

      case 'remove':
        await adminAuth.setCustomUserClaims(uid, { admin: false });
        console.log(`Successfully removed admin claim from user: ${uid}`);
        break;

      case 'check':
        const user = await adminAuth.getUser(uid);
        console.log(`User: ${user.email} (${uid})`);
        console.log('Custom Claims:', JSON.stringify(user.customClaims || {}, null, 2));
        break;

      default:
        console.log('Unknown action. Use add, remove, or check.');
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

main();
