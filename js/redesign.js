const quoteForm = document.querySelector("#quoteForm");
const courseSelect = document.querySelector("#courseSelect");
const systems = [...document.querySelectorAll(".system")];
const cards = [...document.querySelectorAll(".course-card")];
const sizeSelector = document.querySelector(".compare-sizes");

function selectSize(size) {
  if (!sizeSelector) return;
  sizeSelector.querySelector('input[value="' + size + '"]').checked = true;
  for (const system of systems) {
    const choice = system.querySelector('.packages input[value="' + size + '"]');
    choice.checked = true;
    system.querySelector(".price").textContent = choice.dataset.price;
  }
  for (const card of cards) {
    const system = document.getElementById(card.querySelector("[data-course]").dataset.course);
    const price = system.querySelector(".packages input:checked").dataset.price;
    card.querySelector(".card-set").textContent = size + "-hole set";
    card.querySelector(".card-price").textContent = price;
  }
}

function revealSystem(id, focus = false) {
  for (const system of systems) {
    system.hidden = system.id !== id;
    if (!system.hidden && focus) system.focus({ preventScroll: true });
  }
}

if (sizeSelector) {
  selectSize(sizeSelector.querySelector(":checked").value);
  sizeSelector.addEventListener("change", event => selectSize(event.target.value));
  revealSystem(location.hash.slice(1));
  for (const link of document.querySelectorAll("[data-course]")) {
    link.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      revealSystem(link.dataset.course, true);
    });
  }
  window.addEventListener("hashchange", () => {
    const target = location.hash.slice(1);
    revealSystem(target);
    const active = systems.find(system => system.id === target);
    if (active) active.scrollIntoView({ block: "start" });
  });
}

for (const system of systems) {
  const packages = system.querySelector(".packages");
  packages.addEventListener("change", () => {
    selectSize(packages.querySelector(":checked").value);
  });
  const enquire = system.querySelector(".choose-set");
  enquire.addEventListener("click", () => {
    courseSelect.value = enquire.dataset.system + " — " + packages.querySelector(":checked").value + " holes";
  });
}

const drawing = document.querySelector("#mini-wood-drawing");
if (drawing) {
  const button = document.querySelector(".plan-toggle");
  const image = drawing.querySelector("img");
  const plan = drawing.getAttribute("href");
  const render = drawing.dataset.render;
  button.hidden = false;
  button.addEventListener("click", () => {
    const showRender = drawing.getAttribute("href") === plan;
    const file = showRender ? render : plan;
    const description = showRender
      ? "3D view of all 18 Mini Wood holes"
      : "Mini Wood course plan showing all 18 holes";
    image.src = file;
    image.alt = description;
    drawing.href = file;
    drawing.setAttribute("aria-label", "Enlarge: " + description);
    button.textContent = showRender ? "Plan view" : "3D view";
  });
}

for (const media of document.querySelectorAll(".system .media-stage")) {
  const system = media.closest(".system");
  const image = system.querySelector(".media-image");
  const open = system.querySelector(".media-open");
  const caption = system.querySelector(".media-caption");
  const picker = system.querySelector(".hole-picker");
  const select = system.querySelector(".hole-select");
  const views = system.querySelectorAll("[data-view]");
  const name = system.querySelector("h3").textContent;

  function displayImage(source, description) {
    image.src = source;
    image.alt = description;
    open.href = source;
    open.setAttribute("aria-label", "Enlarge: " + description);
    caption.textContent = description;
  }

  function showHole() {
    const option = select.selectedOptions[0];
    displayImage(option.dataset.image, name + " · Hole " + option.textContent);
  }

  select.addEventListener("change", showHole);
  for (const [selector, step] of [[".hole-prev", -1], [".hole-next", 1]]) {
    system.querySelector(selector).addEventListener("click", () => {
      select.selectedIndex = (select.selectedIndex + step + select.length) % select.length;
      showHole();
    });
  }

  for (const button of views) {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      for (const item of views) item.setAttribute("aria-pressed", String(button === item));
      media.classList.toggle("is-drawing", view === "3d" || view === "plans");
      media.classList.toggle("is-hole", view === "holes");
      picker.hidden = view !== "holes";
      if (view === "holes") showHole();
      else displayImage(button.dataset.image, view === "installation" ? caption.dataset.installation :
        name + " · " + (view === "3d" ? "3D" : "Plan") + " view of all 18 holes");
    });
  }
}

const archive = document.querySelector(".gallery-page");
if (archive && new URLSearchParams(location.search).get("course") === "mini-wood") {
  archive.querySelector("h1").textContent = "Mini Wood projects";
  document.title = "Mini Wood projects | MiniGolf";
  archive.querySelector(".gallery-head > p:last-child").hidden = true;
  archive.querySelector(".project-index").hidden = true;
  archive.querySelector(".archive-return").hidden = false;
  for (const project of archive.querySelectorAll(".project-detail")) {
    project.hidden = project.dataset.system !== "mini-wood";
  }
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
