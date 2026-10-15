/* Checks for the portfolio. No installs needed: run `node tests/check.js`.
   Add --online to also check that every external link responds. */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.join(__dirname, "..");
var ONLINE = process.argv.indexOf("--online") > -1;
var failures = 0, passes = 0;

function read(f) { return fs.readFileSync(path.join(ROOT, f), "utf8"); }
function check(name, ok, detail) {
  if (ok) { passes++; } else { failures++; console.log("FAIL  " + name + (detail ? "\n      " + detail : "")); }
}
function isPh(v) { return typeof v === "string" && v.trim().indexOf("[[") === 0; }
function isStr(v) { return typeof v === "string" && v.trim() !== ""; }
function isUrl(v) { return /^https:\/\/[^\s]+$/.test(v); }

/* ---------- syntax ---------- */
var html = read("index.html");
["content.js", "script.js", "hero-gradient.js", "hero-api.js", "hero-dots.js"].forEach(function (f) {
  try { new vm.Script(read(f), { filename: f }); check(f + " parses", true); }
  catch (e) { check(f + " parses", false, e.message); }
});
var inline = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
inline.forEach(function (s, i) {
  try { new vm.Script(s.replace(/<\/?script>/g, "")); check("inline script " + i + " parses", true); }
  catch (e) { check("inline script " + i + " parses", false, e.message); }
});

/* ---------- content.js shape ---------- */
var sandbox = { window: {} };
vm.runInNewContext(read("content.js"), sandbox);
var C = sandbox.window.CONTENT;
check("content.js sets window.CONTENT", !!C);
if (!C) { process.exit(1); }

["name", "role", "location", "resumeFile"].forEach(function (k) { check("CONTENT." + k + " is set", isStr(C[k]) && !isPh(C[k])); });
check("hero headline contains accent text", C.hero.headline.indexOf(C.hero.accent) > -1);
check("hero has rotating words", Array.isArray(C.hero.rotating) && C.hero.rotating.length > 0);

check("email looks valid", /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(C.links.email), C.links.email);
["linkedin", "github"].forEach(function (k) {
  var v = C.links[k];
  check("links." + k + " is an https URL or placeholder", isPh(v) || isUrl(v), v);
});

check("resume PDF exists", fs.existsSync(path.join(ROOT, C.resumeFile)), C.resumeFile);
if (fs.existsSync(path.join(ROOT, C.resumeFile))) {
  var head = fs.readFileSync(path.join(ROOT, C.resumeFile)).slice(0, 5).toString();
  check("resume file is a real PDF", head === "%PDF-", head);
}

C.terminal.forEach(function (l, i) {
  check("terminal line " + i + " is valid", ["cmd", "code", "out"].indexOf(l.t) > -1 && typeof l.s === "string");
});

// Stats must be parseable by the count-up (a number somewhere in the value).
C.stats.forEach(function (s) {
  check("stat '" + s.label + "' has a number", /\d/.test(s.value) && isStr(s.label), s.value);
});

// Every visible project needs the core fields, valid links and a known artwork.
var VISUALS = ["scatter", "graph", "bars", "donut"];
var visible = C.projects.filter(function (p) { return !isPh(p.name); });
check("at least one project is visible", visible.length > 0);
visible.forEach(function (p) {
  var n = "project '" + p.name + "'";
  ["category", "problem", "approach"].forEach(function (k) { check(n + " has " + k, isStr(p[k]) && !isPh(p[k])); });
  check(n + " has a stack", Array.isArray(p.stack) && p.stack.length > 0);
  check(n + " github is URL or placeholder", isPh(p.github) || isUrl(p.github), p.github);
  check(n + " demo is URL or placeholder", isPh(p.demo) || isUrl(p.demo), p.demo);
  if (p.visual) { check(n + " visual is known", VISUALS.indexOf(p.visual) > -1, p.visual); }
});
var names = visible.map(function (p) { return p.name; });
check("project names are unique", new Set(names).size === names.length);

// Experience: visible jobs need a period and org; nested projects need text.
C.experience.filter(function (j) { return !isPh(j.title); }).forEach(function (j) {
  check("job '" + j.title + "' has org and period", isStr(j.org) && isStr(j.period) && !isPh(j.period));
  (j.projects || []).forEach(function (p) { check("job project '" + p.name + "' has text", isStr(p.text)); });
});

// Each core skill card should highlight at least one project when hovered (same rule as script.js).
var tagSets = [];
visible.forEach(function (p) { tagSets.push([p.name, p.category].concat(p.stack || []).join("|").toLowerCase()); });
C.experience.forEach(function (j) { (j.projects || []).forEach(function (p) { tagSets.push([p.name].concat(p.tags || []).join("|").toLowerCase()); }); });
C.core.forEach(function (c) {
  var hit = (c.match || []).some(function (w) { return tagSets.some(function (t) { return t.indexOf(w.toLowerCase()) > -1; }); });
  check("core skill '" + c.name + "' matches a project", hit, (c.match || []).join(", "));
});

C.skills.forEach(function (g) {
  check("skill group '" + g.group + "' has items", Array.isArray(g.items) && g.items.length > 0);
  check("skill group '" + g.group + "' has no duplicates", new Set(g.items).size === g.items.length);
});
C.education.forEach(function (e) { check("education '" + e.title + "' complete", isStr(e.title) && isStr(e.org) && isStr(e.period)); });
(C.achievements || []).forEach(function (a, i) { check("achievement " + i + " is text", isStr(a)); });

/* ---------- Python-first hero ---------- */
check("role leads with Python, not AI/ML", /^Python Developer/.test(C.role) && C.role.indexOf("AI/ML") === -1, C.role);
check("hero eyebrow leads with Python", /^Python developer/i.test(C.hero.eyebrow), C.hero.eyebrow);
var heroHtml = read("index.html");
["apiCard", "apiTabs", "apiPath", "apiTime", "apiBody", "heroDots"].forEach(function (id) {
  check("index.html has #" + id + " for the hero", heroHtml.indexOf('id="' + id + '"') > -1);
});
check("Inter Tight loads as a variable font (needed for the bolding headline)", /Inter\+Tight:wght@\d+\.\.\d+/.test(heroHtml));
check("hero-api.js and hero-dots.js load after content.js", heroHtml.indexOf('src="hero-api.js"') > heroHtml.indexOf('src="content.js"') && heroHtml.indexOf('src="hero-dots.js"') > heroHtml.indexOf('src="content.js"'));

// The API card builds JSON from content.js: run it against the real content and parse what it renders.
(function () {
  var src = read("hero-api.js"), texts = [];
  var stub = function () {
    return { appendChild: function () {}, setAttribute: function () {}, addEventListener: function () {}, classList: { add: function () {}, remove: function () {} }, style: {},
      set textContent(v) { texts.push(v); }, get textContent() { return ""; } };
  };
  var doc = { getElementById: stub, createElement: stub };
  var win = { CONTENT: C, matchMedia: function () { return { matches: true }; } }; // reduced motion: renders instantly
  try {
    vm.runInNewContext(src, { window: win, document: doc, JSON: JSON, Math: Math, setTimeout: setTimeout, requestAnimationFrame: function () {}, cancelAnimationFrame: function () {} });
    var headAt = -1;
    texts.forEach(function (t, i) { if (typeof t === "string" && t.indexOf("HTTP 200 OK") === 0) { headAt = i; } });
    var body = texts.slice(headAt + 1).filter(function (t) { return typeof t === "string"; }).join("");
    var data = JSON.parse(body);
    check("API card 'me' response is valid JSON", true);
    check("API card shows the name from content.js", data.name === C.name, data.name);
    check("API card hides placeholder values", body.indexOf("[[") === -1);
    check("API card stack matches the core skills", JSON.stringify(data.stack) === JSON.stringify(C.core.map(function (c) { return c.name; })));
  } catch (e) { check("API card renders valid JSON from content.js", false, e.message); }
})();

/* ---------- stacked project cards ---------- */
var stackCss = read("styles.css");
check("styles.css makes project slots sticky", /\.bento\.stack \.pslot \{[^}]*position: sticky/.test(stackCss));
check("stacking only on large screens", /@media \(min-width: 900px\) and \(min-height: 600px\) \{(?:\s|\/\*[\s\S]*?\*\/)*\.bento\.stack/.test(stackCss));
check("script.js uses the same breakpoint as the CSS", read("script.js").indexOf('matchMedia("(min-width: 900px) and (min-height: 600px)")') > -1);

/* ---------- index.html <-> script.js ---------- */
var script = read("script.js");
var ids = {};
html.replace(/\sid="([^"]+)"/g, function (_, id) { ids[id] = (ids[id] || 0) + 1; });
Object.keys(ids).forEach(function (id) { check("id '" + id + "' is unique", ids[id] === 1); });
var used = {};
script.replace(/\$\("([^"]+)"\)/g, function (_, id) { used[id] = true; });
Object.keys(used).forEach(function (id) { check("index.html has #" + id + " (used by script.js)", !!ids[id]); });
html.replace(/href="#([^"]+)"/g, function (_, id) { check("in-page link #" + id + " has a target", !!ids[id]); });
html.replace(/(?:src|href)="([^"#][^"]*)"/g, function (_, f) {
  if (/^[a-z]+:/i.test(f)) { return; }
  check("local file " + f + " exists", fs.existsSync(path.join(ROOT, f)));
});
check("index.html loads content.js before script.js", html.indexOf('src="content.js"') > -1 && html.indexOf('src="content.js"') < html.indexOf('src="script.js"'));

/* ---------- hero gradient ---------- */
// hero-gradient.js parses these tokens as hex colours, in both themes.
var css = read("styles.css");
["--bg", "--g-a", "--g-b", "--g-c"].forEach(function (t) {
  var re = new RegExp(t + ":\s*([^;]+);", "g"), m, n = 0;
  while ((m = re.exec(css))) { n++; check("styles.css " + t + " is a hex colour", /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(m[1].trim()), m[1]); }
  check("styles.css defines " + t + " for light and dark", n >= 2, n + " definition(s)");
});
check("index.html has the hero gradient canvas", /<canvas[^>]+id="heroGl"/.test(html));
check("hero-gradient.js loads after script.js", html.indexOf('src="hero-gradient.js"') > html.indexOf('src="script.js"'));

/* ---------- optional: external links ---------- */
function done() {
  console.log((failures ? "\n" : "") + passes + " passed, " + failures + " failed");
  process.exit(failures ? 1 : 0);
}
if (!ONLINE) { done(); }
else {
  var urls = [C.links.github].concat(visible.map(function (p) { return p.github; }), visible.map(function (p) { return p.demo; }))
    .filter(function (u) { return isStr(u) && !isPh(u); });
  Promise.all(urls.map(function (u) {
    return fetch(u, { method: "HEAD", redirect: "follow" })
      .then(function (r) { check("link responds: " + u, r.ok, "HTTP " + r.status); })
      .catch(function (e) { check("link responds: " + u, false, e.message); });
  })).then(done);
  // LinkedIn blocks automated requests (HTTP 999), so it is not checked here.
}
