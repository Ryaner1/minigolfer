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


/* ---------------------------------------------------------
   Get scrollbar measurements
   --------------------------------------------------------- */

function getScrollData() {

  const maxScroll =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const trackHeight =
    golfTrack.clientHeight;

  const ballHeight =
    golfBall.offsetHeight;

  const maxBallMovement =
    trackHeight - ballHeight;

  return {
    maxScroll,
    maxBallMovement
  };
}


/* ---------------------------------------------------------
   Move golf ball when the page is scrolled normally
   --------------------------------------------------------- */

function moveGolfBall() {

  if (!golfBall || !golfTrack || draggingGolfBall) {
    return;
  }

  const {
    maxScroll,
    maxBallMovement
  } = getScrollData();

  if (maxScroll <= 0 || maxBallMovement <= 0) {

    golfBall.style.top = "0px";

    return;
  }

  const progress =
    window.scrollY / maxScroll;

  golfBall.style.top =
    `${progress * maxBallMovement}px`;
}


/* ---------------------------------------------------------
   Start dragging the golf ball
   --------------------------------------------------------- */

if (golfBall && golfTrack) {

  golfBall.addEventListener("pointerdown", (event) => {

    draggingGolfBall = true;

    dragStartY = event.clientY;

    dragStartScroll = window.scrollY;

    golfBall.setPointerCapture(event.pointerId);

    golfBall.style.cursor = "grabbing";

    event.preventDefault();
  });


  /* -------------------------------------------------------
     Drag golf ball
     ------------------------------------------------------- */

  golfBall.addEventListener("pointermove", (event) => {

    if (!draggingGolfBall) {
      return;
    }

    event.preventDefault();


    const {
      maxScroll,
      maxBallMovement
    } = getScrollData();


    if (maxScroll <= 0 || maxBallMovement <= 0) {
      return;
    }


    /* How far the mouse has moved */

    const mouseMovement =
      event.clientY - dragStartY;


    /*
      Convert the mouse movement on the small
      scrollbar into movement through the entire page.
    */

    const scrollMovement =
      mouseMovement *
      (maxScroll / maxBallMovement);


    /*
      Calculate the new page position.
    */

    let newScroll =
      dragStartScroll + scrollMovement;


    /*
      Keep the page inside its limits.
    */

    newScroll = Math.max(
      0,
      Math.min(
        newScroll,
        maxScroll
      )
    );


    /*
      Scroll the page.
    */

    window.scrollTo(
      0,
      newScroll
    );

  });


  /* -------------------------------------------------------
     Stop dragging
     ------------------------------------------------------- */

  function stopGolfBallDrag(event) {

    if (!draggingGolfBall) {
      return;
    }

    draggingGolfBall = false;

    golfBall.style.cursor = "grab";


    if (event.pointerId !== undefined) {

      try {

        golfBall.releasePointerCapture(
          event.pointerId
        );

      } catch (error) {

        /* Pointer capture already released */

      }

    }


    /*
      Make sure the golf ball is exactly where
      the page currently is.
    */

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


/* ---------------------------------------------------------
   Keep golf ball synchronized with normal scrolling
   --------------------------------------------------------- */

window.addEventListener(
  "scroll",
  moveGolfBall
);

window.addEventListener(
  "resize",
  moveGolfBall
);


/* Initial position */

moveGolfBall();