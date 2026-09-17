# MiniGolf website (simple version)

A static website (HTML/CSS/JS, no build step, no backend) that showcases
your two modular mini-golf systems — **Mini Wood** and **Wood Park** — using
the plan-view and 3D-view sheets you provided, and collects quote requests.

## Opening it

Open `index.html` directly in a browser, or in VS Code use the **Live
Server** extension (right-click `index.html` → "Open with Live Server").

## File structure

```
minigolf/
├── index.html          ← page structure & content
├── css/style.css        ← all styling
├── js/script.js          ← prices, tab switching, lightbox, quote form
└── images/sheets/        ← your 4 original sheets (2 collections × plan/3D)
```

## Editing prices

Open **`js/script.js`** — the first two lines set the prices:

```js
document.getElementById("price-mini-wood").textContent = "€14,900";
document.getElementById("price-wood-park").textContent = "€26,900";
```

Change the numbers (and currency symbol if needed).

## Editing text or the hole list

Open `index.html` and find the `<section class="collection" id="mini-wood">`
or `id="wood-park"` block. The description paragraph and the `<ul
class="hole-list">` are plain text — edit directly.

## Changing the contact email

In `js/script.js`:

```js
const QUOTE_EMAIL = "orders@minigolf.example"; // <-- change this to your real inbox
```

The form has no backend — submitting it opens the visitor's email client
pre-filled with their name, email, chosen course(s) and message, addressed
to this inbox. If you want a real backend (Formspree, Netlify Forms) or a
payment flow (Stripe Checkout), that's the part of `script.js` to replace.

## Swapping images

Replace the files in `images/sheets/` with new versions (keep the same
file names — `mini-wood-plans.png`, `mini-wood-3d.png`,
`wood-park-plans.png`, `wood-park-3d.png`) and the page updates
automatically. Click either image on the live site to see it enlarged.
