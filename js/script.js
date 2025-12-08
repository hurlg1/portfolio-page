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

/* ====== Ergänzungen: Robustere Mobile-Nav-Interaktion (ohne Redeklaration!) ====== */

// Schliessen mit ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    navMenu.classList.remove("show");
    navToggle.classList.remove("active");
  }
});

// Menü schliessen beim Resize (damit Desktop immer korrekt ist)
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navMenu.classList.remove("show");
    navToggle.classList.remove("active");
  }
});

// Mobile: Menü schliessen beim Klick auf einen Link
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      navMenu.classList.remove("show");
      navToggle.classList.remove("active");
    }
  });
});
/* ===== Load Strava Running Data ====== */

async function loadStravaData() {
    const latestRunBox = document.getElementById("latest-run");
    const chartCanvas = document.getElementById("weeklyChart");

    // Wenn Elemente fehlen → JS bricht nicht ab
    if (!latestRunBox || !chartCanvas) {
        console.warn("Running-Section nicht im DOM gefunden.");
        return;
    }

    try {
        const response = await fetch("data/activities.json");
        const activities = await response.json();

        /* ======== LETZTE 5 LÄUFE ======== */
        const lastRuns = activities
            .filter(a => a.type === "Run")
            .slice(0, 5);

        latestRunBox.innerHTML = `<h3>Letzte 5 Läufe</h3>`;

        lastRuns.forEach(run => {
            const distKm = (run.distance / 1000).toFixed(2);
            const timeMin = Math.round(run.moving_time / 60);

            /* Pace korrekt als mm:ss berechnen */
            const paceSeconds = run.moving_time / (run.distance / 1000);
            const paceMin = Math.floor(paceSeconds / 60);
            const paceSec = Math.round(paceSeconds % 60);
            const paceFormatted = `${paceMin}:${paceSec.toString().padStart(2, "0")}`;

            const date = new Date(run.start_date).toLocaleDateString("de-DE");

            latestRunBox.innerHTML += `
                <div class="run-card">
                    <h4>${date}</h4>
                    <p><strong>Distanz:</strong> ${distKm} km</p>
                    <p><strong>Dauer:</strong> ${timeMin} min</p>
                    <p><strong>Pace:</strong> ${paceFormatted} min/km</p>
                </div>
            `;
        });

        /* ======== WOCHENCHART ======== */
        const weekData = Array(7).fill(0);
        const today = new Date();

        activities.forEach(a => {
            if (a.type !== "Run") return;
            const date = new Date(a.start_date);
            const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
            if (diff < 7) {
                weekData[6 - diff] += a.distance / 1000;
            }
        });

        new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
                datasets: [{
                    label: "Kilometer",
                    data: weekData,
                    backgroundColor: "rgba(0, 119, 255, 0.6)",
                    hoverBackgroundColor: "rgba(0, 119, 255, 0.9)",
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#1e293b",
                        titleColor: "#ffffff",
                        bodyColor: "#ffffff",
                        cornerRadius: 6,
                        padding: 10,
                        displayColors: false
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(0, 0, 0, 0.06)" },
                        ticks: {
                            color: "#1e293b",
                            font: { size: 12 }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: "#1e293b",
                            font: { size: 12 }
                        }
                    }
                }
            }
        });

    } catch (err) {
        console.error(err);
        latestRunBox.innerHTML = "<p>Fehler beim Laden der Daten.</p>";
    }
}

/* ============ Event Listener ============ */
document.addEventListener("DOMContentLoaded", loadStravaData);

