// ==========================
// Navigation Toggle
// ==========================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('nav ul');
const navLinks = document.querySelectorAll('nav a');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('show');
});

// Menü schließen, wenn Link geklickt wird
navLinks.forEach(link =>
  link.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
  })
);

// Menü-Reset beim Resize (verhindert Aufpoppen)
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
  }
});
// ==========================
// Back to Top Button
// ==========================
const backToTop = document.getElementById("backToTop");
const SCROLL_TRIGGER = 300;

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > SCROLL_TRIGGER);
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

projects.forEach(({ name, description, link }) => {
  const article = document.createElement("article");
  article.classList.add("project");
  article.innerHTML = `
    <h3>${name}</h3>
    <p>${description}</p>
    <a href="${link}" target="_blank">Repo / Demo</a>
  `;
  projectList.appendChild(article);
});