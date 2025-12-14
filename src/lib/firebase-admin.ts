
import * as admin from 'firebase-admin';

// It's recommended to use environment variables for this.
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length && serviceAccountKey) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

// Only export if the app was initialized
export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminRtdb = admin.apps.length ? admin.database() : null;
