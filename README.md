# Chakshit Gaur: portfolio

Plain HTML/CSS/JS. No build step, no installs.

## Open it
Double-click `index.html`, or run `python -m http.server 8000` in this folder and visit http://localhost:8000.
(The Kanit font loads from Google Fonts; the page falls back to a system font offline.)

## Edit it
Everything you change lives in **`content.js`**.

- `[[ ... ]]` = placeholder. On the public page placeholders are **hidden**.
- Open `index.html?preview` to see them with dashed orange outlines.
- To fill one in: replace the whole `"[[ ... ]]"` text with your real text (remove the brackets).

| What | Where in `content.js` |
|---|---|
| Hero greeting + scrambling words (`rotating`) | `hero` |
| Typing terminal in About (facts only) | `terminal` |
| Count-up numbers in About | `stats` (any number in the value counts up) |
| "What I do" items | `services` |
| What you did since June 2024 | first item in `experience` |
| LinkedIn / GitHub URLs | `links` |
| Project 3 and 4, GitHub/demo links, metrics | `projects` |
| Courses & certifications | `certifications` |
| Skill tiles in the scrolling rows | `skills` |

Only add numbers and claims that are true.

## Files
- `index.html`: page structure
- `styles.css`: dark theme, layout, effects
- `content.js`: all your text and links
- `script.js`: builds the page, the flowing-gradient shader in the hero, scroll effects
- `assets/ChakshitGaur_resume.pdf`: copy of your resume for the Resume button
- `versions/atelier/`: the earlier "Atelier" design, kept for comparison (open its `index.html`)
