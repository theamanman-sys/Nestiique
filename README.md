# Nestiique

A single-page website for **Nestiique** — a *café, chicken house and bakery*.

The design follows the elegant, editorial restaurant template used by
Ralph Lauren's Paris restaurant pages: a full-bleed hero, generous
whitespace, high-contrast serif display type, alternating image/text
"room" stories, a quote panel, a location block and a "More to Explore"
carousel — reimagined in a **beige & burgundy** palette.

The site is fully static (no build step, no dependencies) and is ready to
upload to any web host.

---

## Preview locally

Open `index.html` directly, or serve the folder (recommended, so the SVGs
and fonts resolve correctly):

```bash
# with Node (no install required)
node tools/serve.mjs
# then open http://localhost:5173
```

```bash
# or with any static server
npx serve .
python -m http.server 5173
```

---

## Structure

```
Nestiique/
├─ index.html            # all page markup
├─ css/
│  └─ styles.css         # design tokens + every component
├─ js/
│  └─ main.js            # nav, carousel, menu tabs, modal, forms, reveal
├─ assets/
│  └─ img/               # hand-built SVG artwork (no external images)
│     ├─ hero.svg
│     ├─ reservations.svg
│     ├─ dish-1..5.svg
│     ├─ cafe.svg
│     ├─ chicken.svg
│     ├─ bakery.svg
│     ├─ private-events.svg
│     ├─ logo-mark.svg
│     └─ favicon.svg
└─ tools/
   └─ serve.mjs          # tiny local static server for development
```

There are **no third-party JavaScript libraries**. The only external
request is the Google Fonts stylesheet (Cormorant Garamond + Inter); the
site degrades gracefully to Georgia / system fonts if it is unavailable.

---

## Design tokens

All colours and type live at the top of `css/styles.css`:

| Token group | Values |
| --- | --- |
| Beige | `#FBF7F0` `#F5EEE2` `#EDE2D1` `#E0D0B6` `#CDB894` `#B79E76` |
| Burgundy | `#9C3446` `#85283A` `#6E1B2A` `#54121F` `#370B14` |
| Neutrals | espresso `#241611`, ink `#2A1A14`, cream `#F6EFE4` |
| Display type | *Cormorant Garamond* → Didot → Georgia |
| Body type | *Inter* → system-ui |

Change `--burgundy-700` and the beige ramp to re-skin the whole site.

---

## Editing content

Everything is plain HTML. Common edits:

- **Business details (address, phone, email, hours)** — search
  `index.html` for `12 Rue des Archives`, `+33 (0)1 00 00 00 00`,
  `hello@nestiique.com` and the `.hours` list.
- **Menu items** — the `.menu-panel` lists (Brunch, Lunch & Dinner,
  Dessert & Bakery, Coffee & Tea, Wine & Cocktails).
- **Imagery** — replace any `.svg` in `assets/img/` with a photo
  (`.jpg`/`.webp`) and update the matching `src` in `index.html`. The
  layout uses `object-fit: cover`, so any aspect ratio works.

> The address, phone number, email addresses and menu prices are
> placeholders — swap in the real details before launch.

---

## Deploy

Upload the whole folder to your host (Netlify, Vercel, GitHub Pages,
cPanel, S3, …). There is nothing to compile.

- **GitHub Pages** — push the repo, then *Settings → Pages → Deploy from
  branch → `main` / root*.
- **Netlify / Vercel** — drag the folder in, or connect the repo; leave
  the build command empty and set the publish directory to `.`.

---

## Accessibility & performance notes

- Semantic landmarks, a skip link, visible focus states, ARIA on tabs,
  the reservation dialog and accordion-style navigation.
- `prefers-reduced-motion` disables animation.
- All artwork is inline-optimised SVG, so the page is lightweight and
  crisp at any size.
