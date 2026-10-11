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
│  └─ main.js            # nav, intro video, carousel, menu tabs, modal, forms, reveal
├─ assets/
│  ├─ img/               # hand-built SVG artwork (no external images)
│  │  ├─ hero.svg
│  │  ├─ reservations.svg
│  │  ├─ dish-1..5.svg
│  │  ├─ cafe.svg
│  │  ├─ chicken.svg
│  │  ├─ bakery.svg
│  │  ├─ private-events.svg
│  │  ├─ logo-mark.svg
│  │  └─ favicon.svg
│  └─ video/
│     └─ intro.mp4       # opening clip (~730 KB, 560×560, ~6s)
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

- **Business details (address, phone, email, hours)** — the address is
  `1234 Street, Addis Ababa, Ethiopia` and the phone is
  `+251 99 201 3589` (search `index.html` for those, plus
  `hello@nestiique.com` and the `.hours` list).
- **Menu items** — the `.menu-panel` lists, grouped into seven tabs:
  Breakfast, Healthy & Fasting, Snacks & Extras, Meals & Sandwiches,
  Fresh Pressed Juices, Coffee & Tea, Refresh & Pastry. Long panels use
  `<h3 class="menu-group">` headings to break them into sections (e.g.
  *Hot*, *Teas*, *Herbal*, *Cold*).
- **Imagery** — replace any `.svg` in `assets/img/` with a photo
  (`.jpg`/`.webp`) and update the matching `src` in `index.html`. The
  layout uses `object-fit: cover`, so any aspect ratio works.
- **Intro video** — swap `assets/video/intro.mp4` for a new clip; keep the
  filename or edit the `src` on `#introVideo`. It is muted (browsers block
  autoplay with sound), autoplays once per page load, then fades out. A
  "Skip intro" button, a `duration + 1s` backstop timer and a
  `prefers-reduced-motion` check all guarantee it can never trap a visitor.
  The backdrop is the `--intro-bg` token in `css/styles.css`, sampled from
  the clip's own border colour (`#CCC1A5`) so the letterboxing around the
  square clip is invisible. Re-sample and update it if you swap the clip.

> The email addresses (`hello@nestiique.com`, `events@nestiique.com`) are
> still placeholders — swap in the real ones before launch. Menu prices are
> in Ethiopian Birr (Br) and are inclusive of VAT & service charge.

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
