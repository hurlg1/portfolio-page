// Navigation Toggle
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("header nav ul");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Back to Top Button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
