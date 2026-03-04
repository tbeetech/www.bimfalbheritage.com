const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  let credential;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      credential = admin.credential.cert(serviceAccount);
    } catch (e) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY is set but could not be parsed as JSON. ' +
        'Make sure the value is valid JSON (not base64). Error: ' + e.message
      );
    }
  } else {
    // Fall back to Application Default Credentials (useful on Google Cloud / Cloud Run)
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
