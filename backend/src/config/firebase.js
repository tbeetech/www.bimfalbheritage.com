const admin = require('firebase-admin');

let firebaseAvailable = false;

if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      firebaseAvailable = true;
    } catch (e) {
      console.warn(
        '[firebase] Service account key invalid – falling back to local JSON store. (' + e.message + ')'
      );
    }
  } else {
    console.warn(
      '[firebase] FIREBASE_SERVICE_ACCOUNT_KEY not set – falling back to local JSON store.'
    );
  }
}

const db = firebaseAvailable ? admin.firestore() : null;

let bucket = null;
if (firebaseAvailable) {
  try {
    bucket = admin.storage().bucket();
  } catch {
    // No storage bucket configured – image uploads will use local disk
  }
}

module.exports = { admin, db, bucket, firebaseAvailable };
