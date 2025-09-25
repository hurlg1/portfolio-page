// Liste der Projekte
const projects = [
  {
    name: "Projekt 1",
    description: "Kurze Beschreibung von Projekt 1",
    link: "#"
  },
  {
    name: "Projekt 2",
    description: "Kurze Beschreibung von Projekt 2",
    link: "#"
  },
  {
    name: "Projekt 3",
    description: "Kurze Beschreibung von Projekt 3",
    link: "#"
  }
];

// Container für die Projekte finden
const projectList = document.querySelector(".project-list");

// Projekte dynamisch einfügen
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
