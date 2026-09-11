// Theme toggle (persisted per browser via localStorage)
(function () {
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  var saved = null;
  try { saved = localStorage.getItem("site-theme"); } catch (e) {}

  if (saved) root.setAttribute("data-theme", saved);

  function currentTheme() {
    if (root.getAttribute("data-theme")) return root.getAttribute("data-theme");
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyIcon() {
    if (!toggle) return;
    toggle.textContent = currentTheme() === "dark" ? "☀️" : "🌙";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("site-theme", next); } catch (e) {}
      applyIcon();
    });
  }
  applyIcon();
})();

// Open the first "av nezikin" section by default, keep the rest collapsed
(function () {
  var sections = document.querySelectorAll(".nezek");
  if (sections.length) sections[0].setAttribute("open", "");
})();
