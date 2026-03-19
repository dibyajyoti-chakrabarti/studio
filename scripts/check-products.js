const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // I need to find if this exists

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkProducts() {
  const snapshot = await db.collection('products').get();
  console.log('Total products:', snapshot.size);
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}

checkProducts().catch(console.error);
