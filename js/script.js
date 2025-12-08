/* =========================================================
   NAVIGATION
========================================================= */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("nav ul");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    navMenu.classList.remove("show");
    navToggle.classList.remove("active");
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navMenu.classList.remove("show");
    navToggle.classList.remove("active");
  }
});

/* =========================================================
   BACK TO TOP BUTTON
========================================================= */
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 300);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================================================
   HEADER SCROLL BEHAVIOR
========================================================= */
const header = document.querySelector(".header");
let lastScrollY = 0;

window.addEventListener("scroll", () => {
  const current = window.scrollY;

  if (current > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled", "hide");
  }

  if (current > lastScrollY && current > 400) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollY = current;
});

/* =========================================================
   LOCAL STORAGE HELPERS
========================================================= */
function cacheData(key, fallback) {
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
}

/* ABOUT + SKILLS */
const aboutContentEl = document.querySelector("#about .about-content p");
const skillsListEl = document.querySelector("#skills .skills-list");

const skills = cacheData(
  "skills",
  [...skillsListEl.querySelectorAll("span")].map(el => el.textContent)
);

skillsListEl.innerHTML = skills.map(skill => `<span>${skill}</span>`).join("");

/* =========================================================
   STRAVA DATA HANDLING
========================================================= */

async function loadStravaData() {
  const latestRunBox = document.getElementById("latest-run");
  const chartCanvas = document.getElementById("weeklyChart");

  if (!latestRunBox || !chartCanvas) return;

  try {
    const response = await fetch("data/activities.json");
    const activities = await response.json();

    renderLatestRuns(activities, latestRunBox);
    renderLastUpdated(activities);
    renderWeeklyChart(activities, chartCanvas);

  } catch (err) {
    console.error(err);
    latestRunBox.innerHTML = "<p>Fehler beim Laden der Daten.</p>";
  }
}

/* =========================================================
   RENDER LATEST RUNS
========================================================= */
function renderLatestRuns(activities, container) {
  const lastRuns = activities.filter(a => a.type === "Run").slice(0, 8);

  const template = document.getElementById("run-template");
  container.innerHTML = "";

  lastRuns.forEach(run => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".run-title").textContent = run.name ?? "Lauf";
    clone.querySelector(".run-date").textContent =
      new Date(run.start_date).toLocaleDateString("de-DE");

    clone.querySelector(".run-distance").textContent =
      `${(run.distance / 1000).toFixed(2)} km`;

    clone.querySelector(".run-elevation").textContent =
      `${run.total_elevation_gain || 0} m`;

    clone.querySelector(".run-duration").textContent =
      formatDuration(run.moving_time);

    clone.querySelector(".run-pace").textContent =
      `${formatPace(run.moving_time, run.distance)} min/km`;

    container.appendChild(clone);
  });
}

/* =========================================================
   FORMAT HELPERS
========================================================= */
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return h > 0
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`;
}

function formatPace(timeSec, distanceM) {
  const paceSec = timeSec / (distanceM / 1000);
  const min = Math.floor(paceSec / 60);
  const sec = Math.round(paceSec % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

/* =========================================================
   LAST UPDATED
========================================================= */
function renderLastUpdated(activities) {
  const el = document.getElementById("run-updated");
  const date = new Date(activities[0].start_date).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  el.textContent = `Zuletzt Aktualisiert: ${date}`;
}

/* =========================================================
   WEEKLY CHART
========================================================= */
function renderWeeklyChart(activities, canvas) {
  const ctx = canvas.getContext("2d");

  const DAYS = 7;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // "Heute" nur als Datum (00:00 Uhr)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Labels & Daten vorbereiten (ältester Tag links)
  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const labels = [];
  const kmData = new Array(DAYS).fill(0);

  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * MS_PER_DAY);
    labels.push(dayNames[d.getDay()]);
  }

  // Läufe der letzten 7 Tage einsortieren
  activities.forEach(run => {
    if (run.type !== "Run") return;

    const raw = new Date(run.start_date_local || run.start_date);
    const runDate = new Date(raw.getFullYear(), raw.getMonth(), raw.getDate()); // Uhrzeit weg

    const diffDays = Math.round((today - runDate) / MS_PER_DAY);

    if (diffDays >= 0 && diffDays < DAYS) {
      const index = DAYS - 1 - diffDays; // ältester links, neuester rechts
      kmData[index] += run.distance / 1000;
    }
  });
// Wochentotal berechnen
const totalKm = kmData.reduce((a, b) => a + b, 0);

// Formatieren auf zwei Nachkommastellen
document.getElementById("weekly-total").textContent =
    `Total: ${totalKm.toFixed(2)} km`;

  // Farben (dein Blau)
  const lineColor = "rgba(33,150,243,1)";
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(33,150,243,0.25)");
  gradient.addColorStop(1, "rgba(33,150,243,0)");

  // Falls schon ein Chart existiert → zerstören
  if (window.weeklyChartInstance) {
    window.weeklyChartInstance.destroy();
  }

  window.weeklyChartInstance = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        data: kmData,
        borderColor: lineColor,
        backgroundColor: gradient,
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: lineColor,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false } // kein Hover
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#6b7280",
            font: { size: 12 }
          }
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.08)" },
          ticks: {
            color: "#6b7280",
            font: { size: 12 }
          }
        }
      }
    }
  });
}

// Helfer: CSS-Variable im JS verwenden
function varPrimary() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--clr-primary")
    .trim();
}

/* =========================================================
   BOOTSTRAP
========================================================= */
document.addEventListener("DOMContentLoaded", loadStravaData);
