// Fill these in from: Firebase Console → Project settings → General →
// "Your apps" → Web app → SDK setup and configuration → Config.
// These values are safe to expose in client-side code; access is controlled
// by Firestore/Auth security rules, not by hiding this object.
export const firebaseConfig = {
  apiKey: "AIzaSyD3V5JUb5aIq2jD5VxAhlW5paLBGgHs5XE",
  authDomain: "avot-926d7.firebaseapp.com",
  projectId: "avot-926d7",
  storageBucket: "avot-926d7.firebasestorage.app",
  messagingSenderId: "569034737658",
  appId: "1:569034737658:web:ae8d7d394a7ad3d7bf4643",
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PASTE_");
