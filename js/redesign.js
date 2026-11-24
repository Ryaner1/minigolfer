// Keyboard access and focus management for course image previews.
(() => {
  const dialog = document.getElementById("lightbox");
  const close = document.getElementById("lightboxClose");
  if (!dialog || !close) return;
  dialog.setAttribute("aria-modal", "true");
  let opener;
  document.querySelectorAll(".viewer-img").forEach(image => {
    image.setAttribute("aria-label", image.alt + ". Open enlarged view");
    image.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); image.click(); }
    });
    image.addEventListener("click", () => { opener = image; close.focus(); });
  });
  new MutationObserver(() => {
    if (dialog.classList.contains("show")) document.body.style.overflow = "hidden";
    else { document.body.style.overflow = ""; if (opener) { opener.focus(); opener = null; } }
  }).observe(dialog, {attributes:true, attributeFilter:["class"]});
  dialog.addEventListener("keydown", event => {
    if (event.key === "Tab") { event.preventDefault(); close.focus(); }
  });
  document.querySelectorAll(".viewer-tabs").forEach(group => {
    const update = () => group.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button.classList.contains("active"))));
    update();
    group.addEventListener("click", update);
  });
})();
