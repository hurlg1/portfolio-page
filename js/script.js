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
  const weekData = Array(7).fill(0);
  const today = new Date();

  activities.forEach(a => {
    if (a.type !== "Run") return;
    const diff = Math.floor((today - new Date(a.start_date)) / 86400000);
    if (diff < 7) weekData[6 - diff] += a.distance / 1000;
  });

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      datasets: [{
        label: "Kilometer",
        data: weekData,
        backgroundColor: "rgba(33,150,243,0.65)",
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

/* =========================================================
   BOOTSTRAP
========================================================= */
document.addEventListener("DOMContentLoaded", loadStravaData);
