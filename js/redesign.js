const quoteForm = document.querySelector("#quoteForm");
const courseSelect = document.querySelector("#courseSelect");
const systems = [...document.querySelectorAll(".system")];
const courseLinks = [...document.querySelectorAll("[data-course]")];

function showSystem(id) {
  const selected = systems.find(system => system.id === id);
  if (!selected) return;
  for (const system of systems) system.hidden = system !== selected;
  for (const link of courseLinks) {
    link.setAttribute("aria-current", String(link.dataset.course === id));
  }
}

if (systems.length) {
  showSystem(systems.some(s => "#" + s.id === location.hash) ? location.hash.slice(1) : systems[0].id);
  for (const link of courseLinks) {
    link.addEventListener("click", event => {
      event.preventDefault();
      showSystem(link.dataset.course);
      history.pushState(null, "", link.hash);
    });
  }
  window.addEventListener("hashchange", () => showSystem(location.hash.slice(1)));
}

for (const system of systems) {
  const media = system.querySelector(".media-stage");
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
  const packages = system.querySelector(".packages");
  packages.addEventListener("change", () => {
    system.querySelector(".price").textContent = packages.querySelector(":checked").dataset.price;
  });
  system.querySelector(".choose-set").addEventListener("click", () => {
    courseSelect.value = name + " — " + packages.querySelector(":checked").value + " holes";
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
