import { getDb, getAuthInstance, isReady } from "./auth.js";
import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

export async function getLessonProgress(lessonId) {
  const auth = getAuthInstance();
  if (!isReady() || !auth?.currentUser) return {};
  const ref = doc(getDb(), "users", auth.currentUser.uid, "progress", lessonId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().sections || {} : {};
}

export async function setSectionComplete(lessonId, sectionId, complete) {
  const auth = getAuthInstance();
  if (!isReady() || !auth?.currentUser) {
    throw new Error("יש להתחבר כדי לשמור התקדמות.");
  }
  const ref = doc(getDb(), "users", auth.currentUser.uid, "progress", lessonId);
  const snap = await getDoc(ref);
  const sections = snap.exists() ? snap.data().sections || {} : {};
  sections[sectionId] = complete;
  await setDoc(ref, { sections, updatedAt: new Date().toISOString() }, { merge: true });
}
