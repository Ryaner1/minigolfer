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
let dragStartY = 0;
let dragStartScroll = 0;
let dragStartBallTop = 0;


/* ---------------------------------------------------------
   Calculate scrollbar size
   --------------------------------------------------------- */

function getScrollbarInfo() {

  const maxScroll =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const trackHeight =
    golfTrack.clientHeight;

  const ballHeight =
    golfBall.offsetHeight;

  const maxBallTravel =
    trackHeight - ballHeight;

  return {
    maxScroll,
    maxBallTravel
  };
}


/* ---------------------------------------------------------
   Update golf ball from normal scrolling
   --------------------------------------------------------- */

function updateGolfBall() {

  if (!golfBall || !golfTrack) return;

  if (draggingGolfBall) return;

  const {
    maxScroll,
    maxBallTravel
  } = getScrollbarInfo();

  if (maxScroll <= 0 || maxBallTravel <= 0) {

    golfBall.style.top = "0px";

    return;
  }

  const progress =
    window.scrollY / maxScroll;

  golfBall.style.top =
    `${progress * maxBallTravel}px`;
}


/* ---------------------------------------------------------
   Drag golf ball
   --------------------------------------------------------- */

if (golfBall && golfTrack) {

  golfBall.addEventListener("pointerdown", (event) => {

    draggingGolfBall = true;

    dragStartY = event.clientY;
    dragStartScroll = window.scrollY;

    /*
      Remember where the ball was when
      the drag started.
    */

    dragStartBallTop =
      parseFloat(
        getComputedStyle(golfBall).top
      ) || 0;


    /*
      Turn off smooth scrolling while dragging.
    */

    document.documentElement.style.scrollBehavior = "auto";

    golfBall.setPointerCapture(event.pointerId);

    golfBall.style.cursor = "grabbing";

    event.preventDefault();
  });


  golfBall.addEventListener("pointermove", (event) => {

    if (!draggingGolfBall) return;

    event.preventDefault();

    const {
      maxScroll,
      maxBallTravel
    } = getScrollbarInfo();

    if (maxScroll <= 0 || maxBallTravel <= 0) {
      return;
    }


    /* -----------------------------------------------------
       Move the golf ball exactly with the mouse
       ----------------------------------------------------- */

    const mouseDelta =
      event.clientY - dragStartY;


    let newBallTop =
      dragStartBallTop + mouseDelta;


    /*
      Keep the ball inside the track.
    */

    newBallTop = Math.max(
      0,
      Math.min(
        newBallTop,
        maxBallTravel
      )
    );


    /*
      Visually move the golf ball.
    */

    golfBall.style.top =
      `${newBallTop}px`;


    /* -----------------------------------------------------
       Convert golf-ball position into page scroll
       ----------------------------------------------------- */

    const scrollProgress =
      newBallTop / maxBallTravel;

    const newScroll =
      scrollProgress * maxScroll;


    /*
      Scroll immediately.
    */

    window.scrollTo({
      top: newScroll,
      left: 0,
      behavior: "auto"
    });

  });


  /* -------------------------------------------------------
     Stop dragging
     ------------------------------------------------------- */

  function endGolfBallDrag(event) {

    if (!draggingGolfBall) return;

    draggingGolfBall = false;

    golfBall.style.cursor = "grab";


    /*
      Restore normal smooth scrolling.
    */

    document.documentElement.style.scrollBehavior = "";


    if (event.pointerId !== undefined) {

      try {

        golfBall.releasePointerCapture(
          event.pointerId
        );

      } catch (error) {}

    }


    updateGolfBall();
  }


  golfBall.addEventListener(
    "pointerup",
    endGolfBallDrag
  );

  golfBall.addEventListener(
    "pointercancel",
    endGolfBallDrag
  );
}


/* ---------------------------------------------------------
   Normal page scrolling
   --------------------------------------------------------- */

window.addEventListener(
  "scroll",
  updateGolfBall
);


/* ---------------------------------------------------------
   Window resizing
   --------------------------------------------------------- */

window.addEventListener(
  "resize",
  updateGolfBall
);


/* ---------------------------------------------------------
   Initial position
   --------------------------------------------------------- */

updateGolfBall();