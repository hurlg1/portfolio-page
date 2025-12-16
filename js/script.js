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
   LAST UPDATED RUNS
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

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const labels = [];
  const kmData = new Array(DAYS).fill(0);

  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * MS_PER_DAY);
    labels.push(dayNames[d.getDay()]);
  }

  activities.forEach(run => {
    if (run.type !== "Run") return;

    const raw = new Date(run.start_date_local || run.start_date);
    const runDate = new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
    const diffDays = Math.round((today - runDate) / MS_PER_DAY);

    if (diffDays >= 0 && diffDays < DAYS) {
      const index = DAYS - 1 - diffDays;
      kmData[index] += run.distance / 1000;
    }
  });

  // Wochentotal & Gesamtzeit
  const totalKm = kmData.reduce((a, b) => a + b, 0);
  let totalTimeSec = 0;

  activities.forEach(run => {
    if (run.type !== "Run") return;

    const rawDate = new Date(run.start_date_local || run.start_date);
    const runDate = new Date(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate());
    const diffDays = Math.round((today - runDate) / MS_PER_DAY);

    if (diffDays >= 0 && diffDays < DAYS) {
      totalTimeSec += run.moving_time;
    }
  });

  const hours = Math.floor(totalTimeSec / 3600);
  const minutes = Math.floor((totalTimeSec % 3600) / 60);

  const formattedTime =
    hours > 0 ? `${hours}h ${minutes.toString().padStart(2, "0")}m` : `${minutes}m`;

  document.getElementById("weekly-total").textContent =
    `Total: ${totalKm.toFixed(2)} km · Time: ${formattedTime}`;

  const lineColor = "rgba(33,150,243,1)";
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(33,150,243,0.25)");
  gradient.addColorStop(1, "rgba(33,150,243,0)");

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
        tooltip: { enabled: false }
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
/* ===============================
   CLEAN SIDEBAR NAVIGATION
=============================== */
const burger = document.querySelector(".nav-burger");
const navPanel = document.getElementById("navPanel");
const navOverlay = document.getElementById("navOverlay");

function closeNav() {
  navPanel.classList.remove("open");
  navOverlay.classList.remove("show");
}

burger.addEventListener("click", () => {
  navPanel.classList.toggle("open");
  navOverlay.classList.toggle("show");
});

navOverlay.addEventListener("click", closeNav);

document.querySelectorAll(".nav-panel a").forEach(link => {
  link.addEventListener("click", closeNav);
});

/* ===============================
   SCROLLSPY 
=============================== */
const navLinks = document.querySelectorAll(".nav-desktop a, .nav-panel a");
const sections = [...document.querySelectorAll("section[id]")];

function setActiveById(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

// sofort aktiv setzen 
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    setActiveById(id);
  });
});

/* =========================================================
   BOOTSTRAP
========================================================= */
document.addEventListener("DOMContentLoaded", loadStravaData);
