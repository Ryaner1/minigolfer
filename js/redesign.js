const quoteForm = document.querySelector("#quoteForm");
const courseSelect = document.querySelector("#courseSelect");

for (const course of document.querySelectorAll(".course-row")) {
  const drawing = course.querySelector(".drawing-image");
  const image = drawing.querySelector("img");
  const viewButtons = course.querySelectorAll("[data-view]");
  const name = course.querySelector("h3").textContent;
  for (const button of viewButtons) {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      const url = "images/sheets/" + course.id + "-" + view + ".png";
      drawing.href = url;
      image.src = url;
      image.alt = name + ", all 18 holes in " + (view === "3d" ? "3D" : "plan view");
      for (const item of viewButtons) item.setAttribute("aria-pressed", String(item === button));
    });
  }

  const packages = course.querySelector(".packages");
  packages.addEventListener("change", () => {
    course.querySelector(".price").textContent = packages.querySelector(":checked").dataset.price;
  });
  course.querySelector(".quote-link").addEventListener("click", () => {
    const holes = packages.querySelector(":checked").value;
    courseSelect.value = name + " — " + holes + " holes";
  });
}

for (const gallery of document.querySelectorAll(".project-gallery")) {
  const main = gallery.querySelector(".gallery-main");
  const large = main.querySelector("img");
  const buttons = gallery.querySelectorAll(".thumbs button");
  const name = gallery.closest("article").querySelector("h2").textContent.replace(/\.$/, "");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const source = button.querySelector("img").getAttribute("src");
      large.src = source;
      large.alt = name + ", installation photo " + (index + 1);
      main.href = source;
      for (const item of buttons) item.setAttribute("aria-pressed", String(item === button));
    });
  });
}

const dialog = document.querySelector(".zoom-dialog");
if (dialog && typeof dialog.showModal === "function") {
  const enlarged = dialog.querySelector(".enlarged");
  const caption = dialog.querySelector(".zoom-caption");
  for (const link of document.querySelectorAll(".zoom")) {
    link.addEventListener("click", event => {
      event.preventDefault();
      enlarged.src = link.href;
      enlarged.alt = link.querySelector("img").alt;
      caption.textContent = enlarged.alt;
      dialog.showModal();
    });
  }
  dialog.querySelector(".close-zoom").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
}

if (quoteForm) {
  quoteForm.addEventListener("submit", async event => {
    event.preventDefault();
    const button = quoteForm.querySelector("[type=submit]");
    if (button.disabled) return;
    const status = quoteForm.querySelector(".form-status");
    button.disabled = true;
    status.textContent = "Sending your enquiry…";
    try {
      const response = await fetch(quoteForm.action, {
        method: "POST",
        body: new FormData(quoteForm),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Enquiry was not accepted");
      quoteForm.reset();
      status.textContent = "Thank you. Your enquiry has been sent.";
    } catch {
      status.textContent = "Your enquiry could not be sent. Please try again.";
    } finally {
      button.disabled = false;
    }
  });
}
