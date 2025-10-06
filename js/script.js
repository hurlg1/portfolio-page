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

// ==========================
// Live La Liga Integration
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "77c6a6872474a921064d3d21c5c264d2"; 
  const url = "https://api-football-v1.p.rapidapi.com/v3/standings?season=2025&league=140"; // La Liga

  fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
    }
  })
  .then(res => res.json())
  .then(data => {
    const standings = data.response[0].league.standings[0];
    const tbody = document.querySelector("#la-liga-table tbody");
    tbody.innerHTML = "";

    standings.forEach((team, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i+1}</td><td>${team.team.name}</td><td>${team.points}</td>`;

      if(team.team.name.toLowerCase().includes("barcelona")){
        tr.classList.add("highlight");
        document.getElementById("barcelona-match").textContent = `FC Barcelona aktuell: ${team.points} Punkte`;
      }

      tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById("barcelona-match").textContent = "Live-Daten nicht verfügbar.";
  });
});
