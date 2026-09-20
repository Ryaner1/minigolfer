/* ==========================================================
   MiniGolf — site script (simplified two-course version)
   ========================================================== */

// ---------------------------------------------------------
// EDIT PRICES HERE
// ---------------------------------------------------------
const priceMiniWood9 = document.getElementById("price-mini-wood-9");
const priceMiniWood12 = document.getElementById("price-mini-wood-12");
const priceMiniWood18 = document.getElementById("price-mini-wood-18");
const priceWoodPark9 = document.getElementById("price-wood-park-9");
const priceWoodPark12 = document.getElementById("price-wood-park-12");
const priceWoodPark18 = document.getElementById("price-wood-park-18");

if (priceMiniWood9) priceMiniWood9.textContent = "€9,500";
if (priceMiniWood12) priceMiniWood12.textContent = "€11,500";
if (priceMiniWood18) priceMiniWood18.textContent = "€14,500";
if (priceWoodPark9) priceWoodPark9.textContent = "€14,500";
if (priceWoodPark12) priceWoodPark12.textContent = "€19,500";
if (priceWoodPark18) priceWoodPark18.textContent = "€24,500";

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

let draggingGolfBall = false;

function moveGolfBall() {
  if (!golfBall || !golfTrack || draggingGolfBall) return;

  const scrollTop = window.scrollY;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const trackHeight = golfTrack.clientHeight;
  const ballHeight = golfBall.offsetHeight;
  const maxBallMovement = trackHeight - ballHeight;

  if (maxScroll <= 0) {
    golfBall.style.top = "0px";
    return;
  }

  const scrollProgress = scrollTop / maxScroll;

  golfBall.style.top =
    `${scrollProgress * maxBallMovement}px`;
}


/* Move page when dragging the golf ball */

if (golfBall && golfTrack) {

  golfBall.addEventListener("pointerdown", (event) => {

    draggingGolfBall = true;

    golfBall.setPointerCapture(event.pointerId);

    golfBall.style.cursor = "grabbing";

    event.preventDefault();
  });


  golfBall.addEventListener("pointermove", (event) => {

    if (!draggingGolfBall) return;

    const trackRect = golfTrack.getBoundingClientRect();

    const ballHeight = golfBall.offsetHeight;

    const maxBallMovement =
      trackRect.height - ballHeight;

    let newTop =
      event.clientY -
      trackRect.top -
      ballHeight / 2;

    /* Keep the ball inside the track */

    newTop = Math.max(
      0,
      Math.min(newTop, maxBallMovement)
    );

    golfBall.style.top = `${newTop}px`;


    /* Convert golf-ball position into page scroll */

    const scrollProgress =
      maxBallMovement > 0
        ? newTop / maxBallMovement
        : 0;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    window.scrollTo({
      top: scrollProgress * maxScroll,
      behavior: "auto"
    });

  });


  function stopGolfBallDrag(event) {

    if (!draggingGolfBall) return;

    draggingGolfBall = false;

    golfBall.style.cursor = "grab";

    if (event.pointerId !== undefined) {
      try {
        golfBall.releasePointerCapture(event.pointerId);
      } catch (error) {
        /* Pointer capture may already be released */
      }
    }

    moveGolfBall();
  }


  golfBall.addEventListener(
    "pointerup",
    stopGolfBallDrag
  );

  golfBall.addEventListener(
    "pointercancel",
    stopGolfBallDrag
  );
}


window.addEventListener("scroll", moveGolfBall);
window.addEventListener("resize", moveGolfBall);

moveGolfBall();