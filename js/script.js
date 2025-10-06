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
// Live La Liga Integration via Netlify Function
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
  const url = "/.netlify/functions/la-liga"; // Serverless Function
  const barcaElem = document.getElementById("barcelona-match");
  const tbody = document.querySelector("#la-liga-table tbody");

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Fehler ${res.status}`);

    const data = await res.json();
    console.log("Live-Daten:", data); // Debug

    if (!data.response || !data.response[0]?.league?.standings) {
      throw new Error("Ungültige Datenstruktur von der Function");
    }

    const standings = data.response[0].league.standings[0];
    tbody.innerHTML = "";

    standings.forEach((team, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i+1}</td><td>${team.team.name}</td><td>${team.points}</td>`;

      if (team.team.name.toLowerCase().includes("barcelona")) {
        tr.classList.add("highlight");
        if (barcaElem) {
          barcaElem.textContent = `FC Barcelona aktuell: ${team.points} Punkte`;
        }
      }

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Fehler beim Laden der La Liga Daten:", err);
    if (barcaElem) barcaElem.textContent = "Live-Daten nicht verfügbar.";
    tbody.innerHTML = `<tr><td colspan="3">Fehler beim Laden der Tabelle</td></tr>`;
  }
});
