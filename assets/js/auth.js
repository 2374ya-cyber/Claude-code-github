import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

// Firebase Auth requires an email address. Users only choose a username, so
// we turn it into a fake email under a fixed local domain and keep a
// username -> email lookup in Firestore ("usernames" collection) for login.
const USERNAME_DOMAIN = "arba-avot-users.local";

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

function usernameToEmail(username) {
  return `${username}@${USERNAME_DOMAIN}`;
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

export function isReady() {
  return isFirebaseConfigured;
}

export function getDb() {
  return db;
}

export function getAuthInstance() {
  return auth;
}

export async function registerUser({ firstName, lastName, fatherPhone, motherPhone, username, password }) {
  if (!isFirebaseConfigured) {
    throw new Error("ההרשמה עדיין לא מוגדרת באתר. נסו שוב מאוחר יותר.");
  }
  const cleanUsername = normalizeUsername(username);
  const usernameRef = doc(db, "usernames", cleanUsername);
  const existing = await getDoc(usernameRef);
  if (existing.exists()) {
    throw new Error("שם המשתמש הזה כבר תפוס, נסו שם אחר.");
  }

  const email = usernameToEmail(cleanUsername);
  let credential;
  try {
    credential = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      throw new Error("שם המשתמש הזה כבר תפוס, נסו שם אחר.");
    }
    if (err.code === "auth/weak-password") {
      throw new Error("הסיסמה קצרה מדי (לפחות 6 תווים).");
    }
    throw new Error("ההרשמה נכשלה, נסו שוב.");
  }

  await updateProfile(credential.user, { displayName: `${firstName} ${lastName}` });

  await setDoc(doc(db, "users", credential.user.uid), {
    firstName,
    lastName,
    fatherPhone,
    motherPhone,
    username: cleanUsername,
    createdAt: new Date().toISOString(),
  });
  await setDoc(usernameRef, { uid: credential.user.uid, email });

  return credential.user;
}

export async function loginUser({ username, password }) {
  if (!isFirebaseConfigured) {
    throw new Error("ההתחברות עדיין לא מוגדרת באתר. נסו שוב מאוחר יותר.");
  }
  const cleanUsername = normalizeUsername(username);
  const usernameRef = doc(db, "usernames", cleanUsername);
  const snap = await getDoc(usernameRef);
  if (!snap.exists()) {
    throw new Error("שם משתמש או סיסמה שגויים.");
  }
  const { email } = snap.data();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw new Error("שם משתמש או סיסמה שגויים.");
  }
}

export async function logoutUser() {
  if (!isFirebaseConfigured) return;
  await signOut(auth);
}

export function watchAuthState(callback) {
  if (!isFirebaseConfigured) {
    callback(null);
    return;
  }
  onAuthStateChanged(auth, callback);
}
