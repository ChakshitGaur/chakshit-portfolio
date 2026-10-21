# Project notes for Claude (and for future me)

Chakshit Gaur's personal portfolio. Plain HTML, CSS and JS: no build step, no installs.
Live site: https://chakshitgaur.github.io/chakshit-portfolio/ (GitHub Pages, served from `main`, root folder).
`README.md` explains the basics but is partly out of date; this file is the current source of truth.

## Working rules (important)
- **Never commit or push to `main`.** Make a branch, push it, open a pull request, and let the owner merge. Merging to `main` publishes the site within about a minute.
- **Do not push or open a PR until the owner asks.** Commit locally, report, and wait.
- **Only write facts that are true** (from the resume, the project READMEs, or things the owner has confirmed). Never invent numbers, skills, employers or results. For anything uncertain, ask. Add skills only when the owner says they use them.
- When the owner wants to see something first ("map it out", "show me"), show a visual or a plan and wait for approval before building.
- The stealth startup is described deliberately vaguely. Do not add product or client details beyond what `content.js` already says.

## Files
| File | What it does |
|---|---|
| `index.html` | Page structure and asset links (carry `?v=` numbers, see below) |
| `content.js` | **All text and links.** Sections: `hero`, `howIWork`, `stack`, `core`, `links`, `resumeFile`, `updated`, `about`, `stats`, `experience`, `projects`, `skills` |
| `script.js` | Builds every section from `content.js` and runs the effects |
| `styles.css` | Light and dark editorial theme |
| `hero-api.js`, `hero-dots.js`, `hero-gradient.js` | Hero effects (API card, dot grid, WebGL gradient) |
| `assets/ChakshitGaurResume.pdf` | The resume served by the Resume buttons |
| `tests/check.js` | Structural checks: `node tests/check.js` |

## Page order
Hero (with a thin skills ticker) → About → Experience → Projects → a big outlined skills band → Skills → Contact. Sections are numbered 01 to 04 in `index.html` and the nav follows the same order.

## How things work
- **Skills data.** `core` has five cards. Each has `name`, `icon`, `tagline` (the generic line shown on the card), `match` (words compared with project tags for the hover highlight) and `skills` (the list shown in the popup when a card is clicked). `skills` holds grouped lists. `stack` is the short list used by the hero API card.
- **Running bars.** Both the thin ticker and the big outlined band show every skill, de-duplicated from `core[].skills` and the grouped `skills` lists. The band moves with scroll and also drifts slowly (CSS `translate` animation, about 70px per second).
- **Experience.** Classic layout: date column on the left, role, company line (`org`, `type`, `location`) and bullets on the right. Hidden `tags` on a role only feed the skill-card hover highlight. **Every bullet is written to wrap to two lines with the second line 90 to 97% full at desktop widths**, because the bullet column is 924px wide. If you edit bullet text, or the column width, re-measure the fill (character count around 235, then check in the browser).
- **Email.** "Send me an email" opens a dialog: default mail app, or a mail service (Gmail, Outlook, Yahoo Mail), or copy the address. The subject is `SUBJECT` in `script.js`.
- **Resume buttons.** They open the PDF in a new tab (browser viewer with print and download). The PDF's header links are `mailto:`, `tel:`, LinkedIn and GitHub; phone viewers often ignore `mailto:` and `tel:`.
- **Section numbers.** The big outlined numbers behind headings are `.sec-head::before` (kept small and faint so they do not touch content).
- **Placeholders.** `[[ ... ]]` text is hidden on the public page and shown dashed with `?preview`. There are none right now. Templates for new entries are in a comment at the bottom of `content.js`.

## Cache-busting
`index.html` loads `styles.css`, `content.js`, `script.js` and the hero files with `?v=N`. **Bump the number of any file you change**, otherwise visitors can keep seeing the old version for a while. The tests ignore the `?v=` suffix.

## Preview and tests
- Preview: `python -m http.server 8765 --directory <this folder> --bind 127.0.0.1`, then open http://127.0.0.1:8765/index.html. Add `?preview` to see placeholders.
- Before committing run `node --check script.js` and `node tests/check.js` (all checks must pass).
- In an automated browser pane, animations and scroll events may not fire. To inspect, inject a style that disables animations and add the `in` class to `.fade` elements. Always check 1280px wide, about 1000px and 375px (no horizontal overflow).

## Resume
- The resume source is LaTeX, kept outside this repo (the latest version is a `.tex` file in `D:\Chakshit\chakshit`). The owner compiles it in Overleaf and sends the PDF.
- To publish a new PDF: check it is one page and the four header links are valid, replace `assets/ChakshitGaurResume.pdf` (same name), then open a PR. Keep the invisible larger tap areas on the header links if possible.
- Keep the portfolio and the resume consistent (roles, dates, skills).

## Style conventions
- No emojis in code or content. Sentence case for headings and labels.
- Text goes in `content.js`; keep logic in `script.js` and look in `styles.css`.
- Use CSS variables (`--ink`, `--muted`, `--accent`, `--surface`, `--line`) so both themes work.
