import { watchAuthState, logoutUser } from "./auth.js";

const loggedOutEl = document.getElementById("auth-area-out");
const loggedInEl = document.getElementById("auth-area-in");
const nameEl = document.getElementById("auth-name");
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await logoutUser();
    window.location.reload();
  });
}

watchAuthState((user) => {
  const isLoggedIn = Boolean(user);
  if (loggedOutEl) loggedOutEl.hidden = isLoggedIn;
  if (loggedInEl) loggedInEl.hidden = !isLoggedIn;
  if (nameEl && user) {
    const firstName = (user.displayName || "").split(" ")[0] || "משתמש";
    nameEl.textContent = `שלום, ${firstName}`;
  }
});
