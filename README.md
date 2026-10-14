# NESTIIQUE

**Living Signatures.** A coffee house, bakery, chicken house, organic provisions
line and event-production studio — built as one static, multi-page site with no
build step and no third-party JavaScript.

---

## Quick start

```bash
node tools/serve.mjs        # http://localhost:5173
node tools/serve.mjs 8080   # or pick a port
```

Deploy by uploading the folder — Netlify, Vercel, GitHub Pages, cPanel, S3.
There is nothing to compile.

---

## Pages

| File | Page | Theme |
| --- | --- | --- |
| `index.html` | Landing — hero, brand pillars, four-houses overview | dark |
| `coffee.html` | Coffee House & Bakery | light |
| `cakes.html` | Personalized Cakes + cake inquiry form (image upload) | dark |
| `chicken.html` | The Chicken House + set meals | light |
| `organics.html` | NESTIIQUE Organics + juice board | dark |
| `events.html` | Catering & Private Events + inquiry form | dark |
| `scan.html` | Table-side QR scan & shop | dark |
| `market.html` | Collection & Market — filters, products, working cart | light |
| `about.html` | The Mechanics of Intent (manifesto) | light |
| `account.html` | Concierge portal + contact, map, socials | light |
| `menu.html` | The full 101-item menu, seven tabs | dark |

---

## Structure

```
Nestiique/
├─ index.html  coffee.html  cakes.html  chicken.html  organics.html
├─ events.html scan.html    market.html about.html   account.html
├─ menu.html
├─ css/
│  └─ styles.css            # design tokens + every component
├─ js/
│  └─ main.js               # intro, nav, reveal, tabs, forms, portal, cart
├─ assets/
│  ├─ img/                  # hand-built SVG artwork (no stock imagery)
│  │  ├─ hero · cafe · chicken · bakery · cake · private-events · reservations
│  │  ├─ dish-1..5 · prod-mug · prod-platter · prod-carafe · prod-cup
│  │  ├─ prod-beans · prod-honey · prod-elixir · qr-placeholder
│  │  └─ logo-mark · favicon
│  ├─ img/Menu/             # source scans of the printed menu cards
│  └─ video/
│     └─ intro.mp4          # opening clip (~730 KB, 560×560, ~6s)
└─ tools/
   └─ serve.mjs             # tiny local static server
```

---

## Design tokens

All colours and type live at the top of `css/styles.css`.

| Token | Value | Role |
| --- | --- | --- |
| `--black` | `#0B0B0B` | matte black page ground |
| `--gold` | `#C5A059` | structural lines, eyebrows, prices |
| `--burgundy` | `#6B1426` | primary buttons, category tags, accents |
| `--beige` | `#E6E1DC` | warm light ground, dark-theme text |
| `--intro-bg` | `#CCC1A5` | sampled from the intro clip's own border |

**Themes.** Each page sets `theme-dark` or `theme-light` on `<body>`. That flips
the semantic variables (`--page-bg`, `--page-fg`, `--muted`, `--line`,
`--card-bg`, `--chrome-bg`), so every component re-skins automatically without
page-level overrides.

Display type is *Cormorant Garamond* → Didot → Georgia; UI type is *Inter* →
system. The only external request is the Google Fonts stylesheet.

---

## Editing content

- **Menu** — `menu.html`, the `.menu-panel` lists. Seven tabs: Breakfast,
  Healthy & Fasting, Snacks & Extras, Meals & Sandwiches, Fresh Pressed
  Juices, Coffee & Tea, Refresh & Pastry. Long panels use
  `<h3 class="menu-group">` headings (e.g. *Hot*, *Teas*, *Herbal*, *Cold*).
  Deep links work: `menu.html#juices` opens that tab.
- **Contact details** — search any page for `concierge@nestiique.com`,
  `+251992013589` or `Ayat, Next to Noah Real Estate`.
- **Products** — `market.html`, the `.product` cards. Each carries
  `data-id`, `data-name`, `data-price`, `data-category`; the cart reads those.
- **Imagery** — swap any `.svg` for a photo (`.jpg`/`.webp`); the layout uses
  `object-fit: cover`, so any aspect ratio works.

### Forms

The cake inquiry, catering and account forms are static — there is no backend.
On submit they validate, show a confirmation, and reset. The cake form's
reference-image field generates a **local preview only**; nothing is uploaded.
Wire the `<form data-form>` submits to a real endpoint when you have one.

### Table-side QR

`scan.html` ships `assets/img/qr-placeholder.svg`, a **non-functional graphic**.
Replace that file with a real QR encoding your deployed market URL. The SVG
alt-text and the on-page developer note both flag it.

### Map pin

`account.html` embeds an OpenStreetMap frame with an **approximate** marker for
Ayat. Replace the `bbox` and `marker` values in the `<iframe src>` with your
exact coordinates. The "Get Directions" button uses a Google Maps *search*
query, so it already resolves to the correct written address.

### Intro video

Swap `assets/video/intro.mp4`; it autoplays muted (browsers block autoplay
with sound), plays once per page load, then fades out over 1.1s. A "Skip
intro" button, a `duration + 1s` backstop timer, error handling, autoplay
rejection handling and a `prefers-reduced-motion` guard mean it can never trap
a visitor. The backdrop is `--intro-bg`, sampled from the clip's own border so
the letterboxing is invisible — re-sample it if you change the clip.

### Cart

`market.html` has a working cart: add, increment, decrement, remove, live
total, and it persists in `localStorage` under `nestiique-cart-v1`. **No payment
is processed** — "Request Order" links to the catering inquiry form. Clear it
with `localStorage.removeItem('nestiique-cart-v1')`.

### Concierge portal

`account.html` is a demo shell — real tab behaviour, sample content and honest
empty states, but no authentication or stored records. It needs a backend
before it can hold real orders or membership data.

---

## Before launch

- [ ] Replace the placeholder QR (`assets/img/qr-placeholder.svg`)
- [ ] Set exact map coordinates on `account.html`
- [ ] Add real Instagram / TikTok / Telegram URLs (currently `href="#"` TODOs)
- [ ] Connect the forms to a real endpoint
- [ ] Decide on a payment provider if the Market should take money
- [ ] Confirm the spellings flagged during menu transcription

---

## Accessibility

- Semantic landmarks, skip link, visible focus rings.
- ARIA on menu tabs, portal tabs and the reservation dialog (`<dialog>` gives
  focus trapping and Escape-to-close natively).
- `prefers-reduced-motion` disables animation and hides the intro video.
- Filter, cart and portal controls are keyboard operable.