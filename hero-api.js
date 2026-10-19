/* Live API card in the hero: a Django REST Framework-style response about you.
   Every endpoint is built from content.js, so it stays in sync with the rest of the page.
   Pick a tab and the JSON "streams in" like a real response. */
(function () {
  "use strict";

  var C = window.CONTENT;
  var card = document.getElementById("apiCard");
  if (!C || !card) { return; }

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function isPh(v) { return typeof v === "string" && v.trim().indexOf("[[") === 0; }
  function real(v) { return typeof v === "string" && v.trim() !== "" && !isPh(v); }
  function reals(list) { return (list || []).filter(real); }

  /* ---------- endpoints (from content.js) ---------- */
  var base = "/api/" + C.name.split(" ")[0].toLowerCase() + "/";
  function me() {
    var o = { name: C.name, role: C.role.replace(/ · /g, ", "), location: C.location };
    o.stack = (C.stack || []).slice();
    if (real(C.status)) { o.status = C.status; }
    var links = {};
    ["github", "linkedin"].forEach(function (k) { if (real(C.links[k])) { links[k] = C.links[k]; } });
    o.links = links;
    return o;
  }
  function projects() {
    return (C.projects || []).filter(function (p) { return real(p.name); }).map(function (p) {
      var o = { name: p.name, stack: reals(p.stack) };
      if (real(p.github)) { o.repo = p.github.replace(/^https:\/\/github\.com\//, "github.com/"); }
      return o;
    });
  }
  function skills() {
    var o = {};
    (C.skills || []).forEach(function (g) { var items = reals(g.items); if (items.length) { o[g.group.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")] = items; } });
    return o;
  }
  function experience() {
    return (C.experience || []).filter(function (j) { return real(j.title); }).map(function (j) {
      var o = { title: j.title, company: j.org, period: j.period.replace(/–/g, "-") };
      var built = (j.projects || []).filter(function (p) { return real(p.name); }).map(function (p) { return p.name; });
      if (built.length) { o.built = built; }
      return o;
    });
  }
  var ENDPOINTS = [
    { label: "me", path: base, data: me },
    { label: "projects", path: base + "projects/", data: projects },
    { label: "skills", path: base + "skills/", data: skills },
    { label: "experience", path: base + "experience/", data: experience },
  ];

  /* ---------- JSON -> coloured tokens ---------- */
  function tokens(value) {
    var json = JSON.stringify(value, null, 2), out = [], re = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?/g, last = 0, m;
    while ((m = re.exec(json))) {
      if (m.index > last) { out.push({ s: json.slice(last, m.index), c: "api-p" }); }
      if (m[1]) {
        out.push({ s: m[1], c: m[2] ? "api-k" : "api-s" });
        if (m[2]) { out.push({ s: m[2], c: "api-p" }); }
      } else { out.push({ s: m[0], c: "api-n" }); }
      last = re.lastIndex;
    }
    if (last < json.length) { out.push({ s: json.slice(last), c: "api-p" }); }
    return out;
  }

  /* ---------- DOM ---------- */
  var tabsEl = document.getElementById("apiTabs");
  var pathEl = document.getElementById("apiPath");
  var timeEl = document.getElementById("apiTime");
  var bodyEl = document.getElementById("apiBody");
  var tabs = ENDPOINTS.map(function (ep, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "api-tab";
    b.textContent = ep.label;
    b.id = "apiTab" + i;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", "apiBody");
    b.setAttribute("aria-selected", "false");
    b.tabIndex = -1;
    b.addEventListener("click", function () { select(i, true); });
    tabsEl.appendChild(b);
    return b;
  });
  tabsEl.addEventListener("keydown", function (e) {
    var cur = tabs.indexOf(document.activeElement);
    if (cur < 0) { return; }
    var next = e.key === "ArrowRight" ? cur + 1 : e.key === "ArrowLeft" ? cur - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
    if (next === null) { return; }
    e.preventDefault();
    next = (next + tabs.length) % tabs.length;
    tabs[next].focus();
    select(next, true);
  });

  var current = -1, raf = 0;
  function render(list, n) {
    bodyEl.textContent = "";
    var head = document.createElement("span");
    head.className = "api-head";
    head.textContent = "HTTP 200 OK\nAllow: GET, HEAD, OPTIONS\nContent-Type: application/json\n\n";
    bodyEl.appendChild(head);
    var left = n;
    for (var i = 0; i < list.length && left > 0; i++) {
      var t = list[i], part = left >= t.s.length ? t.s : t.s.slice(0, left);
      left -= part.length;
      var s = document.createElement("span");
      s.className = t.c;
      s.textContent = part;
      bodyEl.appendChild(s);
    }
    if (n < Infinity) { var caret = document.createElement("span"); caret.className = "api-caret"; bodyEl.appendChild(caret); }
  }
  function select(i, user) {
    if (i === current) { return; }
    current = i;
    var ep = ENDPOINTS[i];
    tabs.forEach(function (t, k) { var on = k === i; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
    bodyEl.setAttribute("aria-labelledby", tabs[i].id);
    pathEl.textContent = ep.path;
    timeEl.textContent = (8 + Math.round(Math.random() * 18)) + " ms";
    var list = tokens(ep.data()), total = list.reduce(function (s, t) { return s + t.s.length; }, 0);
    bodyEl.scrollTop = 0;
    cancelAnimationFrame(raf);
    if (REDUCED) { render(list, Infinity); return; }
    var n = 0, step = Math.max(6, Math.round(total / 70)); // finishes in about a second, whatever the size
    card.classList.add("loading");
    setTimeout(function () {
      card.classList.remove("loading");
      (function frame() {
        n = Math.min(total, n + step);
        render(list, n >= total ? Infinity : n);
        if (n < total && current === i) { raf = requestAnimationFrame(frame); }
      })();
    }, user ? 160 : 0);
  }

  // Start once the card is on screen, so the visitor sees the response arrive.
  function start() { select(0, false); }
  if (REDUCED || !("IntersectionObserver" in window)) { start(); }
  else {
    render([], Infinity);
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); setTimeout(start, 700); } }, { threshold: 0.3 });
    io.observe(card);
  }
})();
