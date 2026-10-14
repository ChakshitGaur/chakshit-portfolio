# Chakshit Gaur: portfolio

Plain HTML/CSS/JS. No build step, no installs.

## Open it
Double-click `index.html`, or run `python -m http.server 8000` in this folder and visit http://localhost:8000.
(Inter Tight and JetBrains Mono load from Google Fonts; the page falls back to system fonts offline.)

## Edit it
Everything you change lives in **`content.js`**.

- `[[ ... ]]` = placeholder. On the public page placeholders are **hidden**.
- Open `index.html?preview` to see them with dashed orange outlines.
- To fill one in: replace the whole `"[[ ... ]]"` text with your real text (remove the brackets).

| What | Where in `content.js` |
|---|---|
| Hero headline, accent words, scrambling words | `hero` |
| Terminal in About (facts only) | `terminal` |
| Five headline skills with a proof line each | `core` |
| All skills, in groups | `skills` |
| What you did since June 2024 | first item in `experience` |
| LinkedIn / GitHub URLs, email | `links` |
| Projects (card art is `visual`: scatter, graph or bars) | `projects` |
| Courses & certifications | `certifications` |
| Achievements (shown under Education) | `achievements` |
| Education scores (optional) | `score` on each `education` item |
| Count-up numbers | `stats` |

Only add numbers and claims that are true.

## Extras built in
- **Hero:** a slow, interactive WebGL gradient behind the headline that leans toward the cursor (`hero-gradient.js`; colours are the `--g-a`, `--g-b`, `--g-c` and `--g-strength` tokens in `styles.css`). It pauses off-screen, shows one still frame for reduced motion, and the hero falls back to its plain look without WebGL. Also a calm, centred headline with rotating words, two buttons, count-up stats and a slow skills ticker.
- **Terminal in About:** types a short Python script about you when it scrolls into view (edit `terminal` in `content.js`).
- **Email:** the address is a normal email link (opens the visitor's own mail app, with a subject filled in), and a "Copy email" button sits next to it for visitors with no mail app. No third-party service is involved.
- **Light/dark theme:** follows the visitor's system setting; the moon/sun button switches and remembers it.
- **Motion:** word-by-word headline reveals, a scroll-driven skills band, a sliding nav highlight, parallax on the outlined numbers, project artwork that draws itself in, stacked project cards that pin under the nav and slide over each other as you scroll (on screens at least 900×600; a plain list otherwise), spotlight glow and tilt on cards, magnetic buttons, a cursor follower, a back-to-top button with a progress ring, confetti on "Copy email", a hidden Konami-code easter egg, and an animated highlighter for phrases wrapped in `**double asterisks**` in the `about` text.
- **Accessibility:** a "Skip to content" link, keyboard focus outlines, and everything animated switches off for visitors who prefer reduced motion. Cursor effects are desktop-only.
## Files
- `index.html`: page structure
- `styles.css`: light editorial theme and layout
- `content.js`: all your text and links
- `script.js`: builds the page and runs the effects
- `hero-gradient.js`: the hero's WebGL gradient
- `assets/ChakshitGaur_resume.pdf`: copy of your resume for the Resume buttons (replace this file when your resume changes)
- `tests/check.js`: checks content, links and rendering; run `node tests/check.js`
