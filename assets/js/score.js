import { watchAuthState } from "./auth.js";
import { getLessonProgress } from "./progress.js";

export const QUIZ_LESSON_ID = "quiz";

let cachedAnswers = {};
let currentUser = null;
const listeners = [];

function render() {
  const badge = document.getElementById("score-badge");
  if (!badge) return;
  const count = Object.values(cachedAnswers).filter(Boolean).length;
  if (currentUser && count > 0) {
    badge.textContent = `ניקוד: ${count}`;
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
}

export function getCachedAnswers() {
  return cachedAnswers;
}

export function getCurrentQuizUser() {
  return currentUser;
}

export function markQuestionCorrect(questionId) {
  cachedAnswers[questionId] = true;
  render();
}

// Fires once immediately if the answer cache is already loaded, and again
// every time it's (re)loaded after an auth-state change.
export function onAnswersReady(callback) {
  listeners.push(callback);
  callback(cachedAnswers);
}

watchAuthState(async (user) => {
  currentUser = user;
  cachedAnswers = user ? await getLessonProgress(QUIZ_LESSON_ID) : {};
  render();
  listeners.forEach((cb) => cb(cachedAnswers));
});
