import { watchAuthState } from "./auth.js";
import { getLessonProgress } from "./progress.js";

const main = document.querySelector("main[data-lesson-id]");
if (main) {
  const lessonId = main.dataset.lessonId;
  const badges = document.querySelectorAll(".nezek-done");

  async function refresh(user) {
    if (!user) {
      badges.forEach((badge) => { badge.hidden = true; });
      return;
    }
    const sections = await getLessonProgress(lessonId);
    badges.forEach((badge) => {
      const sectionId = badge.id.replace(/^done-/, "");
      badge.hidden = !sections[sectionId];
    });
  }

  watchAuthState(refresh);
}
