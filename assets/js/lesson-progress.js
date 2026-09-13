import { watchAuthState } from "./auth.js";
import { getLessonProgress, setSectionComplete } from "./progress.js";

const main = document.querySelector("main[data-lesson-id]");
if (main) {
  const lessonId = main.dataset.lessonId;
  const rows = document.querySelectorAll(".progress-row");

  function renderButton(row, done) {
    const btn = row.querySelector(".progress-toggle");
    btn.textContent = done ? "✓ הושלם" : "סימון כהושלם";
    btn.classList.toggle("done", done);
  }

  async function refresh(user) {
    if (!user) {
      rows.forEach((row) => {
        row.querySelector(".progress-toggle").disabled = true;
        row.querySelector(".progress-hint").hidden = false;
        renderButton(row, false);
      });
      return;
    }
    const sections = await getLessonProgress(lessonId);
    rows.forEach((row) => {
      const btn = row.querySelector(".progress-toggle");
      btn.disabled = false;
      row.querySelector(".progress-hint").hidden = true;
      renderButton(row, Boolean(sections[row.dataset.sectionId]));
    });
  }

  rows.forEach((row) => {
    const btn = row.querySelector(".progress-toggle");
    btn.addEventListener("click", async () => {
      const done = !btn.classList.contains("done");
      btn.disabled = true;
      try {
        await setSectionComplete(lessonId, row.dataset.sectionId, done);
        renderButton(row, done);
      } catch (err) {
        alert(err.message);
      }
      btn.disabled = false;
    });
  });

  watchAuthState(refresh);
}
