import { setSectionComplete } from "./progress.js";
import { QUIZ_LESSON_ID, getCachedAnswers, getCurrentQuizUser, markQuestionCorrect, onAnswersReady } from "./score.js";

const main = document.querySelector("main[data-lesson-id]");
const lessonId = main ? main.dataset.lessonId : null;

function lockQuiz(quizEl, revealCorrect) {
  quizEl.querySelectorAll(".quiz-choice").forEach((b) => {
    b.disabled = true;
    if (revealCorrect && b.dataset.correct === "true") b.classList.add("correct");
  });
}

function markSectionDoneIfAny(quizEl) {
  const sectionId = quizEl.dataset.marksSection;
  if (!sectionId || !lessonId) return;
  const badge = document.getElementById(`done-${sectionId}`);
  if (badge) badge.hidden = false;
  setSectionComplete(lessonId, sectionId, true).catch(() => {
    /* best-effort: badge already updated locally */
  });
}

document.querySelectorAll(".quiz").forEach((quizEl) => {
  const qid = quizEl.dataset.questionId;
  const feedback = quizEl.querySelector(".quiz-feedback");

  quizEl.querySelectorAll(".quiz-choice").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (quizEl.dataset.answered === "true") return;
      quizEl.dataset.answered = "true";

      const isCorrect = btn.dataset.correct === "true";
      lockQuiz(quizEl, true);
      if (!isCorrect) btn.classList.add("incorrect");

      feedback.hidden = false;
      feedback.textContent = isCorrect ? "נכון!" : "לא נכון — התשובה הנכונה מסומנת למעלה.";
      feedback.className = "quiz-feedback " + (isCorrect ? "correct" : "incorrect");

      const user = getCurrentQuizUser();
      if (isCorrect && user) {
        if (!getCachedAnswers()[qid]) {
          markQuestionCorrect(qid);
          try {
            await setSectionComplete(QUIZ_LESSON_ID, qid, true);
          } catch (err) {
            /* best-effort: score already updated locally */
          }
        }
        markSectionDoneIfAny(quizEl);
      }
    });
  });
});

// Runs immediately with whatever's cached, and again after each auth-state
// change (login/logout), so already-answered questions stay locked in.
onAnswersReady((answers) => {
  document.querySelectorAll(".quiz").forEach((quizEl) => {
    const qid = quizEl.dataset.questionId;
    if (answers[qid] && quizEl.dataset.answered !== "true") {
      quizEl.dataset.answered = "true";
      lockQuiz(quizEl, true);
    }
  });
});
