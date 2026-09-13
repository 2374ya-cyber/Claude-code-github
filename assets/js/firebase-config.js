// Fill these in from: Firebase Console → Project settings → General →
// "Your apps" → Web app → SDK setup and configuration → Config.
// These values are safe to expose in client-side code; access is controlled
// by Firestore/Auth security rules, not by hiding this object.
export const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID",
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PASTE_");
