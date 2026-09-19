/* ==========================================================
   MiniGolf — site script (simplified two-course version)
   ========================================================== */

// ---------------------------------------------------------
// EDIT PRICES HERE
// ---------------------------------------------------------
document.getElementById("price-mini-wood-9").textContent = "€9,500";
document.getElementById("price-mini-wood-12").textContent = "€11,500";
document.getElementById("price-mini-wood-18").textContent = "€14,500";
document.getElementById("price-wood-park-9").textContent = "€14,500";
document.getElementById("price-wood-park-12").textContent = "€19,500";
document.getElementById("price-wood-park-18").textContent = "€24,500";


// ---------------------------------------------------------
// Plan / 3D view tabs
// ---------------------------------------------------------
document.querySelectorAll(".viewer-tabs").forEach((tabGroup) => {
  const frame = tabGroup.nextElementSibling;

  tabGroup.querySelectorAll(".view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {

      tabGroup.querySelectorAll(".view-tab").forEach((t) => {
        t.classList.remove("active");
      });

      tab.classList.add("active");

      frame.querySelectorAll(".viewer-img").forEach((img) => {
        img.classList.remove("active");
      });

      document.getElementById(tab.dataset.target).classList.add("active");
    });
  });
});


// ---------------------------------------------------------
// Lightbox — click any plan/3D image to zoom
// ---------------------------------------------------------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

document.querySelectorAll(".viewer-img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
}

document.getElementById("lightboxClose").addEventListener(
  "click",
  closeLightbox
);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
  }
});


// ---------------------------------------------------------
// "Contact us" buttons
// Pre-select the matching option and scroll to the form
// ---------------------------------------------------------
document.querySelectorAll(".quote-btn").forEach((btn) => {
  btn.addEventListener("click", () => {

    document.getElementById("courseSelect").value =
      btn.dataset.value;

    document.getElementById("contact").scrollIntoView({
      behavior: "smooth"
    });

  });
});


// ---------------------------------------------------------
// Contact form
// ---------------------------------------------------------
// Formspree handles the form submission.
// No JavaScript is needed here.


// ---------------------------------------------------------
// Init
// ---------------------------------------------------------
document.getElementById("year").textContent =
  new Date().getFullYear();
  /* =========================================================
   MINI GOLF SCROLLBAR
   ========================================================= */

const golfBall = document.querySelector(".golf-ball");
const golfTrack = document.querySelector(".golf-scroll-track");

function moveGolfBall() {
  if (!golfBall || !golfTrack) return;

  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;

  const maxScroll = documentHeight - windowHeight;
  const trackHeight = golfTrack.clientHeight;
  const ballHeight = golfBall.offsetHeight;

  if (maxScroll <= 0) return;

  const scrollProgress = scrollTop / maxScroll;
  const maxBallMovement = trackHeight - ballHeight;

  golfBall.style.top = `${scrollProgress * maxBallMovement}px`;
}

window.addEventListener("scroll", moveGolfBall);
window.addEventListener("resize", moveGolfBall);

moveGolfBall();