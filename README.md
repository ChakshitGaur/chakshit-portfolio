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
| Terminal in the hero (facts only) | `terminal` |
| Five headline skills with a proof line each | `core` |
| All skills, in groups | `skills` |
| What you did since June 2024 | first item in `experience` |
| LinkedIn / GitHub URLs | `links` |
| Projects (card art is `visual`: scatter, graph or bars) | `projects` |
| Courses & certifications | `certifications` |
| Count-up numbers | `stats` |

Only add numbers and claims that are true.

## Extras built in
- **Light/dark theme:** follows the visitor's system setting; the moon/sun button switches and remembers it.
- **Command palette:** press `Ctrl+K` (or `Cmd+K`) to jump to a section, copy the email, or download the resume.
- **Playground:** two small demos with made-up sample data (a Pandas-style data-cleaning walkthrough and a live logistic-regression classifier). Their code is in `script.js`.
- **Scroll progress bar** along the top.

## Files
- `index.html`: page structure
- `styles.css`: light editorial theme and layout
- `content.js`: all your text and links
- `script.js`: builds the page and runs the effects
- `assets/ChakshitGaur_resume.pdf`: copy of your resume for the Resume buttons
- `versions/atelier/`: an earlier design, kept for comparison
