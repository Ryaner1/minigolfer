/* ==========================================================
   MiniGolf — site script (simplified two-course version)
   Edit prices below, and the QUOTE_EMAIL address near the bottom.
   ========================================================== */

// ---------------------------------------------------------
// EDIT PRICES HERE
// ---------------------------------------------------------
document.getElementById("price-mini-wood").textContent = "\u20AC14,900";
document.getElementById("price-wood-park").textContent = "\u20AC26,900";

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
// "Get a quote" buttons — scroll to the form and pre-check the course
// ---------------------------------------------------------
document.querySelectorAll(".quote-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const course = btn.dataset.course;
    if (course === "Mini Wood") document.getElementById("chk-mini-wood").checked = true;
    if (course === "Wood Park") document.getElementById("chk-wood-park").checked = true;
  });
});

// ---------------------------------------------------------
// Quote form — builds a mailto: with the selected course(s)
// ---------------------------------------------------------
const QUOTE_EMAIL = "orders@minigolf.example"; // <-- change this to your real inbox

document.getElementById("quoteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const courses = Array.from(form.querySelectorAll('input[name="course"]:checked')).map((c) => c.value);

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Interested in: ${courses.length ? courses.join(", ") : "(not specified)"}`,
    "",
    message ? `Message:\n${message}` : "",
  ].join("\n");

  const subject = encodeURIComponent("Quote request — MiniGolf");
  const body = encodeURIComponent(lines);
  window.location.href = `mailto:${QUOTE_EMAIL}?subject=${subject}&body=${body}`;
});

// ---------------------------------------------------------
// init
// ---------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();
