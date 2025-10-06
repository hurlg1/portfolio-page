// ==========================
// Navigation Toggle
// ==========================
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("header nav ul");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// ==========================
// Back to Top Button
// ==========================
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

// ==========================
// Projekte dynamisch einfügen
// ==========================
const projects = [
  { name: "Projekt 1", description: "Kurze Beschreibung von Projekt 1", link: "#" },
  { name: "Projekt 2", description: "Kurze Beschreibung von Projekt 2", link: "#" },
  { name: "Projekt 3", description: "Kurze Beschreibung von Projekt 3", link: "#" },
  { name: "Projekt 4", description: "Kurze Beschreibung von Projekt 4", link: "#" }
];

const projectList = document.querySelector(".project-list");

projects.forEach(proj => {
  const article = document.createElement("article");
  article.classList.add("project");
  article.innerHTML = `
    <h3>${proj.name}</h3>
    <p>${proj.description}</p>
    <a href="${proj.link}">Repo / Demo</a>
  `;
  projectList.appendChild(article);
});

