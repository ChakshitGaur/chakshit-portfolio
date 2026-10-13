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
| LinkedIn / GitHub URLs, email | `links` (LinkedIn is still a `[[ placeholder ]]`, so it is hidden until you paste your URL) |
| Projects (card art is `visual`: scatter, graph or bars) | `projects` |
| Courses & certifications | `certifications` |
| Count-up numbers | `stats` |

Only add numbers and claims that are true.

## Extras built in
- **Hero:** a centred headline with a golden spiral that draws itself behind it, and your first three projects fanned out as cards underneath (they spread on hover and link to Projects). Ideas adapted from the 21st.dev hero components "Centered Hero with Image Fan" and "Hero Golden Spiral".
- **Terminal in About:** types a short Python script about you when it scrolls into view (edit `terminal` in `content.js`).
- **Email:** clicking your address opens a Gmail compose window with your address already in the "To" field. The "Send me a message" box does the same with the visitor's name and message filled in. Nothing is sent from the page, and no server is involved. (To receive messages without the visitor pressing send, you would add a form service such as Formspree; that needs your own account.)
- **Light/dark theme:** follows the visitor's system setting; the moon/sun button switches and remembers it.
- **Motion:** an intro splash (once per tab session), word-by-word headline reveals, a skills ticker and a scroll-driven band, a sliding nav highlight, parallax on the outlined numbers, project artwork that draws itself in, spotlight glow and tilt on cards, magnetic buttons, a cursor follower, a back-to-top button with a progress ring, confetti on email actions, a hidden Konami-code easter egg, and an animated highlighter for phrases wrapped in `**double asterisks**` in the `about` text.
- **Accessibility:** a "Skip to content" link, keyboard focus outlines, labelled form fields, and everything animated switches off for visitors who prefer reduced motion. Cursor effects are desktop-only.
## Files
- `index.html`: page structure
- `styles.css`: light editorial theme and layout
- `content.js`: all your text and links
- `script.js`: builds the page and runs the effects
- `assets/ChakshitGaur_resume.pdf`: copy of your resume for the Resume buttons
- `versions/atelier/`: an earlier design, kept for comparison
