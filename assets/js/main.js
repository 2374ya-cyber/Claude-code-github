// Open the first "av nezikin" section by default, keep the rest collapsed
(function () {
  var sections = document.querySelectorAll(".nezek");
  if (sections.length) sections[0].setAttribute("open", "");
})();
