/* ==========================================================
   MiniGolf — site script (simplified two-course version)
   Edit prices below, and the QUOTE_EMAIL address near the bottom.
   ========================================================== */

// ---------------------------------------------------------
// EDIT PRICES HERE
// ---------------------------------------------------------
document.getElementById("price-mini-wood-9").textContent = "\u20AC9,500";
document.getElementById("price-mini-wood-12").textContent = "\u20AC11,500";
document.getElementById("price-mini-wood-18").textContent = "\u20AC14,500";
document.getElementById("price-wood-park-9").textContent = "\u20AC14,500";
document.getElementById("price-wood-park-12").textContent = "\u20AC19,500";
document.getElementById("price-wood-park-18").textContent = "\u20AC24,500";

// ---------------------------------------------------------
// Plan / 3D view tabs (works independently per section)
// ---------------------------------------------------------
document.querySelectorAll(".viewer-tabs").forEach((tabGroup) => {
  const frame = tabGroup.nextElementSibling; // .viewer-frame
  tabGroup.querySelectorAll(".view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      tabGroup.querySelectorAll(".view-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      frame.querySelectorAll(".viewer-img").forEach((img) => img.classList.remove("active"));
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
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

// ---------------------------------------------------------
// "Contact us" buttons — pre-select the matching option in the
// dropdown and scroll down to the contact form
// ---------------------------------------------------------
document.querySelectorAll(".quote-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("courseSelect").value = btn.dataset.value;
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
});

// ---------------------------------------------------------
// Contact form — builds a mailto: with the selected option
// ---------------------------------------------------------
const QUOTE_EMAIL = "ryan.minigolf@gmail.com"; // <-- change this to your real inbox

document.getElementById("quoteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const course = form.course.value || "(not specified)";

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Interested in: ${course}`,
    "",
    message ? `Message:\n${message}` : "",
  ].join("\n");

  const subject = encodeURIComponent("Enquiry — MiniGolf");
  const body = encodeURIComponent(lines);
  window.location.href = `mailto:${QUOTE_EMAIL}?subject=${subject}&body=${body}`;
});

// ---------------------------------------------------------
// init
// ---------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();