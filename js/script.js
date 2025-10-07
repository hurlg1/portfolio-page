// ==========================
// navigation toggle
// ==========================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('nav ul');
const navLinks = document.querySelectorAll('nav a');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('show');
});

// menü schließen, wenn link geklickt wird
navLinks.forEach(link =>
  link.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
  })
);

// menü-reset beim resize (verhindert aufpoppen)
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
  }
});

// ==========================
// back to top button
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
// caching helper function
// ==========================
function cacheData(key, defaultData) {
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
}

// ==========================
// projekte dynamisch einfügen + caching
// ==========================
const projectList = document.querySelector(".project-list");
const cachedProjects = cacheData('projects', [
  { name: "Projekt 1", description: "Kurze Beschreibung von Projekt 1", link: "#", media: '<img src="img/beach.jpg" alt="Projekt 1">' },
  { name: "Projekt 2", description: "Kurze Beschreibung von Projekt 2", link: "#" },
  { name: "Projekt 3", description: "Kurze Beschreibung von Projekt 3", link: "#" },
  { name: "Projekt 4", description: "Kurze Beschreibung von Projekt 4", link: "#" }
]);

// intersection observer für projekte
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 120);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

function renderProjects(projects) {
  projectList.innerHTML = ''; // vorher löschen
  projects.forEach(({ name, description, link, media }) => {
    const article = document.createElement("article");
    article.classList.add("project");
    article.innerHTML = `
      ${media ? `<div class="project-media">${media}</div>` : `<div class="project-media"></div>`}
      <h3>${name}</h3>
      <p>${description}</p>
      <a href="${link}" target="_blank">Repo / Demo</a>
    `;
    projectList.appendChild(article);
    observer.observe(article);
  });
}

renderProjects(cachedProjects);

// ==========================
// about + skills caching
// ==========================
const aboutContentEl = document.querySelector('#about .about-content p');
const skillsListEl = document.querySelector('#skills .skills-list');

const aboutContent = cacheData('aboutContent', aboutContentEl.textContent);
const skills = cacheData('skills', Array.from(skillsListEl.querySelectorAll('li')).map(li => li.textContent));

aboutContentEl.textContent = aboutContent;

skillsListEl.innerHTML = '';
skills.forEach(skill => {
  const li = document.createElement('li');
  li.textContent = skill;
  skillsListEl.appendChild(li);
});

// ==========================
// header scroll behavior
// ==========================
const header = document.querySelector(".header");
let lastScrollY = window.scrollY;
let scrollDownCount = 0;

window.addEventListener("scroll", () => {
  const currentY = window.scrollY;

  // linie aktivieren nach 50px scroll
  if (currentY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
    header.classList.remove("hide"); // ganz oben wieder sichtbar
    scrollDownCount = 0; // zurücksetzen
  }

  // nur nach unten scrollen zählt
  if (currentY > lastScrollY) {
    scrollDownCount++;
  }

  // nach etwa 4 scrollbewegungen (ca. 600–800px)
  if (scrollDownCount > 4 && currentY > 400) {
    header.classList.add("hide"); // header verschwindet
  }

  lastScrollY = currentY;
});

