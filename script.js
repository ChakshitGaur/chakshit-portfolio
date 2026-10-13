/* Renders the page from content.js. You normally don't need to edit this file. */
(function () {
  "use strict";

  var C = window.CONTENT;
  if (!C) { return; }

  var PREVIEW = /[?&]preview(=|&|$)/.test(location.search);
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HOVER = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  var SVGNS = "http://www.w3.org/2000/svg";
  var H = C.hero || {};

  /* ---------- helpers ---------- */
  function isPh(v) { return typeof v === "string" && v.trim().indexOf("[[") === 0; }
  function show(v) { return typeof v === "string" && v.trim() !== "" && (PREVIEW || !isPh(v)); }
  function $(id) { return document.getElementById(id); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function el(tag, opts, kids) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.cls) { node.className = opts.cls; }
    if (opts.text != null) { node.textContent = opts.text; }
    if (opts.attrs) { Object.keys(opts.attrs).forEach(function (k) { node.setAttribute(k, opts.attrs[k]); }); }
    (kids || []).forEach(function (k) { if (k) { node.appendChild(k); } });
    return node;
  }
  function span(value, cls) {
    var s = el("span", { text: value, cls: cls || "" });
    if (isPh(value)) { s.classList.add("ph"); }
    return s;
  }
  function tagList(items) {
    var list = (items || []).filter(show);
    if (!list.length) { return null; }
    return el("div", { cls: "tags" }, list.map(function (t) {
      var n = el("span", { cls: "tag", text: t });
      if (isPh(t)) { n.classList.add("ph"); }
      return n;
    }));
  }
  function link(href, label, cls, external) {
    if (isPh(href)) { return el("span", { cls: "ph", text: label + " " + href }); }
    var attrs = { href: href };
    if (external) { attrs.target = "_blank"; attrs.rel = "noopener noreferrer"; }
    return el("a", { cls: cls || "", text: label, attrs: attrs });
  }
  function fade(node, d) {
    node.classList.add("fade");
    if (d) { node.style.setProperty("--d", d + "s"); }
    return node;
  }
  function lc(list) { return (list || []).filter(show).join("|").toLowerCase(); }

  document.title = C.name + " | " + C.role.replace(/ · /g, " & ");

  if (PREVIEW) {
    document.body.classList.add("preview");
    var banner = $("preview-banner");
    banner.hidden = false;
    document.documentElement.style.setProperty("--banner-h", banner.offsetHeight + "px");
  }

  /* ---------- nav ---------- */
  $("navResume").setAttribute("href", C.resumeFile);
  $("navResume").setAttribute("download", C.name.replace(/\s+/g, "") + "_Resume.pdf");
  var navLinks = $("navLinks"), navToggle = $("navToggle");
  navToggle.addEventListener("click", function () {
    var open = !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.textContent = open ? "Close" : "Menu";
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) { navLinks.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); navToggle.textContent = "Menu"; }
  });

  /* ---------- hero ---------- */
  $("heroEyebrow").textContent = H.eyebrow || C.role;

  var headline = H.headline || C.name;
  var accentAt = H.accent ? headline.indexOf(H.accent) : -1;
  var title = $("heroTitle");
  title.setAttribute("aria-label", headline);
  var offset = 0;
  headline.split(" ").forEach(function (word, i, arr) {
    var inner = el("span", { text: word, attrs: { style: "--i:" + i } });
    if (accentAt > -1 && offset >= accentAt) { inner.classList.add("accent"); }
    title.appendChild(el("span", { cls: "w", attrs: { "aria-hidden": "true" } }, [inner]));
    if (i < arr.length - 1) { title.appendChild(document.createTextNode(" ")); }
    offset += word.length + 1;
  });

  /* Rotating words (scramble effect) */
  var phrases = (H.rotating || []).filter(function (p) { return typeof p === "string" && p.trim(); });
  var rotateLine = $("rotateLine");
  var liveEl = null, heroOnScreen = true;
  if (phrases.length) {
    rotateLine.setAttribute("aria-label", (H.rotatingPrefix || "") + " " + phrases.join(", "));
    rotateLine.appendChild(el("span", { text: (H.rotatingPrefix || "") + " ", attrs: { "aria-hidden": "true" } }));
    liveEl = el("b", { cls: "rot-live", text: phrases[0], attrs: { "aria-hidden": "true" } });
    var longest = phrases.reduce(function (m, p) { return Math.max(m, p.length); }, 0);
    liveEl.style.display = "inline-block";
    liveEl.style.minWidth = longest + "ch";
    rotateLine.appendChild(liveEl);
    if (!REDUCED) { rotateLine.appendChild(el("span", { cls: "caret", attrs: { "aria-hidden": "true" } })); }
  } else { rotateLine.hidden = true; }

  function scrambleTo(node, from, to, done) {
    var glyphs = "!<>-_\\/[]{}—=+*^?#";
    var len = Math.max(from.length, to.length), queue = [], frame = 0;
    for (var i = 0; i < len; i++) {
      var start = Math.floor(Math.random() * 14);
      queue.push({ from: from[i] || "", to: to[i] || "", start: start, end: start + 10 + Math.floor(Math.random() * 14), ch: "" });
    }
    (function tick() {
      var out = "", complete = 0;
      queue.forEach(function (q) {
        if (frame >= q.end) { complete++; out += q.to; }
        else if (frame >= q.start) { if (!q.ch || Math.random() < 0.28) { q.ch = glyphs[Math.floor(Math.random() * glyphs.length)]; } out += q.ch; }
        else { out += q.from; }
      });
      node.textContent = out;
      if (complete === queue.length) { done(); } else { frame++; requestAnimationFrame(tick); }
    })();
  }
  if (liveEl && phrases.length > 1 && !REDUCED) {
    var pIdx = 0;
    (function cycle() {
      if (document.hidden || !heroOnScreen) { setTimeout(cycle, 700); return; }
      var next = (pIdx + 1) % phrases.length;
      scrambleTo(liveEl, phrases[pIdx], phrases[next], function () { pIdx = next; setTimeout(cycle, 2400); });
    })();
  }

  if (show(C.status)) {
    var st = $("heroStatus");
    st.textContent = C.status;
    if (isPh(C.status)) { st.classList.add("ph"); }
    st.hidden = false;
  }

  /* Cursor-lit dot grid */
  var heroEl = $("hero");
  if (HOVER && !REDUCED) {
    heroEl.addEventListener("pointermove", function (e) {
      var r = heroEl.getBoundingClientRect();
      heroEl.style.setProperty("--mx", (e.clientX - r.left) + "px");
      heroEl.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
    heroEl.addEventListener("pointerleave", function () { heroEl.style.setProperty("--mx", "-400px"); heroEl.style.setProperty("--my", "-400px"); });
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { heroOnScreen = en[0].isIntersecting; }).observe(heroEl);
  }

  /* ---------- stats (count up) ---------- */
  function parseStat(v) {
    var m = /^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(v);
    if (!m) { return null; }
    return { pre: m[1], num: parseFloat(m[2].replace(/,/g, "")), dec: (m[2].split(".")[1] || "").length, comma: m[2].indexOf(",") > -1, suf: m[3] };
  }
  function fmtStat(p, n) {
    var s = n.toFixed(p.dec);
    if (p.comma) { s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
    return p.pre + s + p.suf;
  }
  var counters = [];
  var statsEl = $("stats");
  (C.stats || []).forEach(function (s) {
    var strong = el("strong", { text: s.value });
    var parsed = parseStat(s.value);
    if (parsed && !REDUCED) { strong.setAttribute("aria-label", s.value); strong.textContent = fmtStat(parsed, 0); counters.push({ node: strong, p: parsed }); }
    statsEl.appendChild(el("li", {}, [strong, el("span", { text: s.label })]));
  });
  function runCounter(c) {
    var t0 = null, dur = 1400;
    (function step(ts) {
      if (t0 === null) { t0 = ts; }
      var k = Math.min(1, (ts - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
      c.node.textContent = fmtStat(c.p, c.p.num * eased);
      if (k < 1) { requestAnimationFrame(step); } else { c.node.textContent = fmtStat(c.p, c.p.num); }
    })(performance.now());
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) { return; }
          cio.unobserve(en.target);
          runCounter(counters.filter(function (c) { return c.node === en.target; })[0]);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { cio.observe(c.node); });
    } else { counters.forEach(function (c) { c.node.textContent = fmtStat(c.p, c.p.num); }); }
  }

  /* ---------- terminal (types itself) ---------- */
  var termBody = $("termBody");
  var termLines = (C.terminal || []).filter(function (l) { return l && typeof l.s === "string"; });
  $("termText").textContent = termLines.map(function (l) { return (l.t === "cmd" ? "$ " : "") + l.s; }).join("\n");
  var TOKEN = /("[^"]*"|'[^']*'|#.*$|\b\d[\d,]*\b|\b(?:print|import|from|for|in|def|return|if|else)\b)/g;
  function tokenize(text) {
    var out = [], last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(text)) !== null) {
      if (m.index > last) { out.push({ s: text.slice(last, m.index), c: "" }); }
      var tk = m[0], c = "tk-kw";
      if (tk[0] === '"' || tk[0] === "'") { c = "tk-str"; } else if (tk[0] === "#") { c = "tk-com"; } else if (/^\d/.test(tk)) { c = "tk-num"; }
      out.push({ s: tk, c: c });
      last = m.index + tk.length;
    }
    if (last < text.length) { out.push({ s: text.slice(last), c: "" }); }
    return out;
  }
  var termRows = termLines.map(function (l) {
    var row = el("div", { cls: "tl " + (l.t === "out" ? "out" : l.t === "cmd" ? "cmd" : "code") });
    if (l.t === "cmd") { row.appendChild(el("span", { cls: "prompt", text: "$ " })); }
    var body = el("span");
    row.appendChild(body);
    termBody.appendChild(row);
    return { body: body, tokens: l.t === "code" ? tokenize(l.s) : [{ s: l.s, c: "" }], len: l.s.length, kind: l.t };
  });
  var tcaret = el("span", { cls: "caret-t" });
  function drawRow(r, n) {
    r.body.textContent = "";
    var left = n, rest = "";
    r.tokens.forEach(function (t) {
      if (left >= t.s.length) { left -= t.s.length; r.body.appendChild(el("span", { cls: t.c, text: t.s })); }
      else if (left > 0) { r.body.appendChild(el("span", { cls: t.c, text: t.s.slice(0, left) })); rest += t.s.slice(left); left = 0; }
      else { rest += t.s; }
    });
    if (n < r.len || r.showCaret) { r.body.appendChild(tcaret); }
    if (rest) { r.body.appendChild(el("span", { cls: "ghost", text: rest })); }
  }
  termRows.forEach(function (r) { drawRow(r, REDUCED ? r.len : 0); });
  function typeTerminal() {
    var ri = 0;
    (function nextRow() {
      if (ri >= termRows.length) { var last = termRows[termRows.length - 1]; last.showCaret = true; drawRow(last, last.len); return; }
      var r = termRows[ri], n = 0, speed = r.kind === "cmd" ? 50 : 12;
      if (r.kind === "out") { setTimeout(function () { drawRow(r, r.len); ri++; setTimeout(nextRow, 120); }, 420); return; }
      (function typeChar() {
        n++; drawRow(r, n);
        if (n < r.len) { setTimeout(typeChar, speed); }
        else { r.showCaret = false; drawRow(r, r.len); ri++; setTimeout(nextRow, r.kind === "cmd" ? 340 : 80); }
      })();
    })();
  }
  if (termRows.length && !REDUCED) { setTimeout(typeTerminal, 900); }

  /* ---------- skills: core cards + grouped chips ---------- */
  var coreEl = $("core");
  var coreCards = [];
  (C.core || []).forEach(function (c, i) {
    var proofOk = show(c.proof);
    var card = el("button", { cls: "core-card" + (proofOk && isPh(c.proof) ? " empty" : ""), attrs: { type: "button", "aria-pressed": "false" } }, [
      el("strong", { text: c.name }),
      proofOk ? el("span", {}, [span(c.proof)]) : null,
    ]);
    card.setAttribute("data-match", (c.match || []).join("|").toLowerCase());
    coreEl.appendChild(fade(card, i * 0.06));
    coreCards.push(card);
  });

  var groupsEl = $("groups");
  (C.skills || []).forEach(function (g, i) {
    var items = (g.items || []).filter(show);
    if (!items.length) { return; }
    var chips = el("div", { cls: "chips" }, items.map(function (n, ci) {
      var c = el("span", { cls: "chip", text: n });
      c.style.setProperty("--c", ci);
      if (isPh(n)) { c.classList.add("ph"); }
      return c;
    }));
    groupsEl.appendChild(fade(el("div", { cls: "group" }, [el("h3", { text: g.group }), chips]), i * 0.04));
  });

  /* ---------- projects (bento) ---------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () { a |= 0; a = a + 0x6d2b79f5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function svgEl(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  function art(kind, seed) {
    var r = rng(seed * 9973 + 17), svg = svgEl("svg", { viewBox: "0 0 400 210", preserveAspectRatio: "xMidYMid meet", "aria-hidden": "true" });
    var ink = "currentColor", i;
    if (kind === "graph") {
      var L = [], R = [];
      for (i = 0; i < 6; i++) { L.push([96, 30 + i * 30]); }
      for (i = 0; i < 7; i++) { R.push([304, 22 + i * 28]); }
      L.forEach(function (a, ai) { R.forEach(function (b, bi) {
        if (r() < 0.3) { svg.appendChild(svgEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: ink, "stroke-opacity": 0.2, "stroke-width": 1 })); }
        if ((ai === 2 && bi === 3) || (ai === 4 && bi === 1)) { svg.appendChild(svgEl("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: "accl", "stroke-width": 2, "stroke-dasharray": "5 4" })); }
      }); });
      L.forEach(function (p) { svg.appendChild(svgEl("circle", { cx: p[0], cy: p[1], r: 6, fill: ink })); });
      R.forEach(function (p) { svg.appendChild(svgEl("rect", { x: p[0] - 6, y: p[1] - 6, width: 12, height: 12, rx: 3, fill: "none", stroke: ink, "stroke-width": 1.5 })); });
    } else if (kind === "bars") {
      for (i = 0; i < 12; i++) { var h = 30 + r() * 120; svg.appendChild(svgEl("rect", { x: 40 + i * 28, y: 180 - h, width: 18, height: h, rx: 4, class: i === 8 ? "acc" : "", fill: ink, "fill-opacity": i === 8 ? 1 : 0.8 })); }
      svg.appendChild(svgEl("line", { x1: 30, y1: 181, x2: 380, y2: 181, stroke: ink, "stroke-opacity": 0.3 }));
    } else if (kind === "donut") {
      var raw = [0.4 + r() * 0.1, 0.24 + r() * 0.06, 0.18 + r() * 0.05, 0.12 + r() * 0.04], sum = raw.reduce(function (a, b) { return a + b; }, 0);
      var vals = raw.map(function (v) { return v / sum; }), circ = 2 * Math.PI * 58, acc = 0, ops = [1, 0.8, 0.5, 0.25];
      svg.appendChild(svgEl("circle", { cx: 125, cy: 105, r: 58, fill: "none", stroke: ink, "stroke-opacity": 0.08, "stroke-width": 30 }));
      vals.forEach(function (v, k) {
        svg.appendChild(svgEl("circle", {
          cx: 125, cy: 105, r: 58, fill: "none", "stroke-width": 30, transform: "rotate(-90 125 105)",
          "stroke-dasharray": (v * circ - 3).toFixed(2) + " " + (circ - v * circ + 3).toFixed(2), "stroke-dashoffset": (-acc * circ).toFixed(2),
          class: k === 0 ? "accd" : "", stroke: ink, "stroke-opacity": k === 0 ? 1 : ops[k] * 0.8
        }));
        acc += v;
        svg.appendChild(svgEl("rect", { x: 232, y: 58 + k * 30, width: 10, height: 10, rx: 3, class: k === 0 ? "acc" : "", fill: ink, "fill-opacity": k === 0 ? 1 : ops[k] * 0.8 }));
        svg.appendChild(svgEl("rect", { x: 252, y: 61 + k * 30, width: Math.round(v * 150), height: 5, rx: 2.5, fill: ink, "fill-opacity": 0.22 }));
      });
    } else {
      svg.appendChild(svgEl("line", { x1: 40, y1: 190, x2: 40, y2: 24, stroke: ink, "stroke-opacity": 0.25 }));
      svg.appendChild(svgEl("line", { x1: 40, y1: 190, x2: 372, y2: 190, stroke: ink, "stroke-opacity": 0.25 }));
      svg.appendChild(svgEl("line", { x1: 150, y1: 196, x2: 262, y2: 18, class: "accl", "stroke-width": 1.6, "stroke-dasharray": "6 5" }));
      for (i = 0; i < 38; i++) {
        svg.appendChild(svgEl("circle", { cx: 110 + (r() - 0.5) * 130, cy: 120 + (r() - 0.35) * 110, r: 3.4, fill: ink, "fill-opacity": 0.85 }));
        svg.appendChild(svgEl("circle", { cx: 300 + (r() - 0.5) * 130, cy: 85 + (r() - 0.65) * 110, r: 3.4, class: "acc", "fill-opacity": 0.9 }));
      }
    }
    return svg;
  }

  var bento = $("bento");
  var projectList = (C.projects || []).filter(function (p) { return show(p.name); });
  projectList.forEach(function (p, i) {
    var dl = el("dl");
    [["Problem", p.problem], ["Approach", p.approach]].forEach(function (pair) {
      if (show(pair[1])) { dl.appendChild(el("div", {}, [el("dt", { text: pair[0] }), el("dd", {}, [span(pair[1])])])); }
    });
    var links = el("div", { cls: "plinks" });
    if (show(p.github)) { links.appendChild(link(p.github, "GitHub ↗", "", true)); }
    if (show(p.demo)) { links.appendChild(link(p.demo, "Live demo ↗", "", true)); }

    var artBox = el("div", { cls: "pcard-art" }, [el("span", { cls: "num", text: pad2(i + 1) })]);
    artBox.insertBefore(art(p.visual || ["scatter", "graph", "bars"][i % 3], i + 1), artBox.firstChild);

    var card = el("article", { cls: "pcard", attrs: { "data-tags": [p.name, p.category].concat(p.stack || []).join("|").toLowerCase() } }, [
      artBox,
      el("div", { cls: "pcard-body" }, [
        show(p.category) ? el("p", { cls: "pcard-cat" }, [span(p.category)]) : null,
        el("h3", {}, [span(p.name)]),
        dl,
        show(p.metric) ? el("p", { cls: "metric" }, [span(p.metric)]) : null,
        tagList(p.stack),
        links.childNodes.length ? links : null,
      ]),
    ]);
    if (i === projectList.length - 1 && i % 2 === 0 && projectList.length > 1) { card.classList.add("wide"); }
    bento.appendChild(fade(card, (i % 2) * 0.08));
  });
  if (!projectList.length) { $("projects").hidden = true; }

  /* ---------- experience ---------- */
  var timeline = $("timeline");
  (C.experience || []).forEach(function (job) {
    if (!show(job.title)) { return; }
    var meta = [job.org, job.location].filter(show);
    var orgLine = el("p", { cls: "tl-org" });
    meta.forEach(function (m, i) { if (i) { orgLine.appendChild(document.createTextNode(" · ")); } orgLine.appendChild(span(m)); });

    var right = el("div", {}, [el("h3", {}, [span(job.title)]), meta.length ? orgLine : null]);
    var bullets = (job.bullets || []).filter(show);
    if (bullets.length) { right.appendChild(el("ul", { cls: "tl-bullets" }, bullets.map(function (b) { return el("li", {}, [span(b)]); }))); }
    var projects = (job.projects || []).filter(function (p) { return show(p.name); });
    if (projects.length) {
      right.appendChild(el("div", { cls: "mini-grid" }, projects.map(function (p) {
        return el("article", { cls: "mini", attrs: { "data-tags": [p.name].concat(p.tags || []).join("|").toLowerCase() } }, [el("h4", {}, [span(p.name)]), el("p", { text: p.text }), tagList(p.tags)]);
      })));
    }
    var tags = tagList(job.tags);
    if (tags) { right.appendChild(tags); }
    timeline.appendChild(fade(el("li", { cls: "tl-item" }, [el("div", { cls: "tl-when" }, [show(job.period) ? span(job.period) : null]), right])));
  });

  /* ---------- about + education ---------- */
  var aboutText = $("aboutText");
  // **phrase** in content.js becomes an animated highlighter mark.
  (C.about || []).forEach(function (t) {
    var p = el("p");
    t.split(/\*\*(.+?)\*\*/g).forEach(function (part, i) {
      if (!part) { return; }
      p.appendChild(i % 2 ? el("mark", { text: part }) : document.createTextNode(part));
    });
    aboutText.appendChild(p);
  });
  var edu = $("eduList");
  (C.education || []).forEach(function (e) {
    edu.appendChild(el("li", {}, [el("div", {}, [el("h3", { text: e.title }), el("p", { text: e.org })]), el("span", { cls: "meta", text: e.period })]));
  });
  var certs = (C.certifications || []).filter(function (c) { return show(c.name); });
  if (certs.length) {
    var cl = $("certList");
    certs.forEach(function (c) {
      var sub = [c.issuer, c.year].filter(show);
      cl.appendChild(el("li", {}, [el("div", {}, [el("h4", {}, [span(c.name)]), sub.length ? el("p", {}, [span(sub.join(" · "))]) : null])]));
    });
    $("certWrap").hidden = false;
  }

  /* ---------- contact + footer ---------- */
  var email = show(C.links.email) && !isPh(C.links.email) ? C.links.email : null;
  var SUBJECT = "Hello from your portfolio";
  var mail = $("contactMail");
  if (email) {
    mail.textContent = email;
    mail.setAttribute("href", "mailto:" + email + "?subject=" + encodeURIComponent(SUBJECT));
  } else { mail.hidden = true; $("composer").hidden = true; }

  function copyEmail() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function () { toast("Email copied"); }, function () { toast(email); });
    } else { toast(email); }
  }
  // Confetti burst from a click (or from the element's centre when triggered by keyboard)
  function burstAt(e) {
    if (REDUCED) { return; }
    var x = e.clientX, y = e.clientY;
    if (!e.detail && e.currentTarget) { var r = e.currentTarget.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
    var colors = ["#2f4bff", "#ff9a4d", "#e070dc", "#1fb26b", "#ffd166"];
    for (var i = 0; i < 18; i++) {
      var a = (i / 18) * Math.PI * 2 + Math.random() * 0.4, d = 46 + Math.random() * 60, s = el("i", { cls: "spark" });
      s.style.cssText = "left:" + x + "px;top:" + y + "px;--dx:" + (Math.cos(a) * d).toFixed(1) + "px;--dy:" + (Math.sin(a) * d).toFixed(1) + "px;background:" + colors[i % colors.length];
      document.body.appendChild(s);
      setTimeout((function (n) { return function () { n.remove(); }; })(s), 800);
    }
  }

  var actions = $("contactActions");
  if (email) {
    var copyBtn = el("button", { cls: "btn btn-outline-light", text: "Copy email", attrs: { type: "button" } });
    copyBtn.addEventListener("click", function (e) { copyEmail(); burstAt(e); });
    actions.appendChild(copyBtn);
  }

  // Message box: builds a draft for Gmail or the visitor's mail app. Nothing is sent from this page.
  var cName = $("cName"), cMsg = $("cMsg"), cErr = $("cErr");
  cMsg.maxLength = 1500;
  function draft() {
    var msg = cMsg.value.trim();
    if (!msg) { cErr.textContent = "Write a short message first."; cErr.hidden = false; cMsg.focus(); return null; }
    cErr.hidden = true;
    var name = cName.value.trim();
    return { subject: name ? "Portfolio message from " + name : SUBJECT, body: msg + (name ? "\n\n" + name : "") };
  }
  cMsg.addEventListener("input", function () { cErr.hidden = true; });
  $("cGmail").addEventListener("click", function (e) {
    var d = draft(); if (!d || !email) { return; }
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(email) + "&su=" + encodeURIComponent(d.subject) + "&body=" + encodeURIComponent(d.body), "_blank", "noopener");
    burstAt(e);
  });
  $("cMail").addEventListener("click", function (e) {
    var d = draft(); if (!d || !email) { return; }
    var a = el("a", { attrs: { href: "mailto:" + email + "?subject=" + encodeURIComponent(d.subject) + "&body=" + encodeURIComponent(d.body) } });
    document.body.appendChild(a); a.click(); a.remove();
    burstAt(e);
  });

  if (show(C.links.linkedin)) { actions.appendChild(link(C.links.linkedin, "LinkedIn", "btn btn-outline-light", true)); }
  if (show(C.links.github)) { actions.appendChild(link(C.links.github, "GitHub", "btn btn-outline-light", true)); }
  actions.appendChild(el("a", { cls: "btn btn-light", text: "Download resume", attrs: { href: C.resumeFile, download: C.name.replace(/\s+/g, "") + "_Resume.pdf" } }));
  $("copy").textContent = "© " + new Date().getFullYear() + " " + C.name + " · " + C.location;

  /* ---------- skills <-> projects link ---------- */
  var linkables = document.querySelectorAll("[data-tags]");
  function highlight(card) {
    var words = (card.getAttribute("data-match") || "").split("|").filter(Boolean), hits = 0;
    linkables.forEach(function (n) {
      var tags = n.getAttribute("data-tags"), hit = words.some(function (w) { return tags.indexOf(w) > -1; });
      n.classList.toggle("hit", hit);
      if (hit) { hits++; }
    });
    if (hits) { document.body.classList.add("linking"); }
  }
  function clearHighlight() {
    document.body.classList.remove("linking");
    linkables.forEach(function (n) { n.classList.remove("hit"); });
  }
  coreCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () { highlight(card); });
    card.addEventListener("mouseleave", function () { if (!card.classList.contains("on")) { clearHighlight(); } });
    card.addEventListener("focus", function () { highlight(card); });
    card.addEventListener("blur", function () { if (!card.classList.contains("on")) { clearHighlight(); } });
    card.addEventListener("click", function () {
      var wasOn = card.classList.contains("on");
      coreCards.forEach(function (c) { c.classList.remove("on"); c.setAttribute("aria-pressed", "false"); });
      clearHighlight();
      if (!wasOn) { card.classList.add("on"); card.setAttribute("aria-pressed", "true"); highlight(card); }
    });
  });

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) { /* storage unavailable: fine */ }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) { meta.setAttribute("content", t === "dark" ? "#11110f" : "#f4f2ec"); }
  }
  function toggleTheme() { setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"); }
  $("themeBtn").addEventListener("click", toggleTheme);

  $("toTop").addEventListener("click", function () { window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }); });

  /* ---------- scroll progress ---------- */
  var progress = $("progress");
  function onProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    progress.style.transform = "scaleX(" + pct.toFixed(4) + ")";
    $("ring").style.strokeDashoffset = (119.4 * (1 - pct)).toFixed(1);
    $("toTop").classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onProgress, { passive: true });
  window.addEventListener("resize", onProgress);
  onProgress();

  /* ---------- toast + command palette ---------- */
  function toast(msg) {
    var t = el("div", { text: msg, attrs: { role: "status" } });
    t.style.cssText = "position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:300;padding:10px 18px;border-radius:999px;background:var(--inv-bg);color:var(--inv-ink);font-size:0.9rem;box-shadow:0 10px 30px rgba(0,0,0,.25)";
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }
  function goTo(id) { var s = $(id); if (s) { s.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" }); } }

  var commands = [
    { label: "Go to Skills", tag: "Section", run: function () { goTo("skills"); } },
    { label: "Go to Projects", tag: "Section", run: function () { goTo("projects"); } },
    { label: "Go to Experience", tag: "Section", run: function () { goTo("experience"); } },
    { label: "Go to About", tag: "Section", run: function () { goTo("about"); } },
    { label: "Go to Contact", tag: "Section", run: function () { goTo("contact"); } },
    { label: "Write me a message", tag: "Action", run: function () { goTo("contact"); setTimeout(function () { $("cMsg").focus({ preventScroll: true }); }, 700); } }
  ];
  if (show(C.links.email) && !isPh(C.links.email)) {
    commands.push({ label: "Copy email address", tag: "Action", run: function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(C.links.email).then(function () { toast("Email copied"); }, function () { toast(C.links.email); });
      } else { toast(C.links.email); }
    } });
  }
  commands.push({ label: "Download resume", tag: "Action", run: function () {
    var a = el("a", { attrs: { href: C.resumeFile, download: C.name.replace(/\s+/g, "") + "_Resume.pdf" } });
    document.body.appendChild(a); a.click(); a.remove();
  } });
  if (show(C.links.linkedin) && !isPh(C.links.linkedin)) { commands.push({ label: "Open LinkedIn", tag: "Link", run: function () { window.open(C.links.linkedin, "_blank", "noopener"); } }); }
  if (show(C.links.github) && !isPh(C.links.github)) { commands.push({ label: "Open GitHub", tag: "Link", run: function () { window.open(C.links.github, "_blank", "noopener"); } }); }
  commands.push({ label: "Switch light / dark theme", tag: "Action", run: toggleTheme });

  var palette = $("palette"), pInput = $("paletteInput"), pList = $("paletteList");
  var pItems = [], pIndex = 0, pLast = null;
  function pRender() {
    var q = pInput.value.trim().toLowerCase();
    pItems = commands.filter(function (c) { return !q || c.label.toLowerCase().indexOf(q) > -1; });
    pIndex = clamp(pIndex, 0, Math.max(0, pItems.length - 1));
    pList.textContent = "";
    if (!pItems.length) { pList.appendChild(el("li", { cls: "palette-empty", text: "No matching command." })); return; }
    pItems.forEach(function (c, i) {
      var li = el("li", { attrs: { role: "option", "aria-selected": String(i === pIndex) } }, [el("span", { text: c.label }), el("small", { text: c.tag })]);
      li.addEventListener("click", function () { pRun(i); });
      li.addEventListener("mousemove", function () { if (pIndex !== i) { pIndex = i; pMark(); } });
      pList.appendChild(li);
    });
  }
  function pMark() {
    Array.prototype.forEach.call(pList.children, function (li, i) { li.setAttribute("aria-selected", String(i === pIndex)); });
    var sel = pList.children[pIndex];
    if (sel && sel.scrollIntoView) { sel.scrollIntoView({ block: "nearest" }); }
  }
  function pOpen() { pLast = document.activeElement; pInput.value = ""; pIndex = 0; pRender(); palette.hidden = false; pInput.focus(); }
  function pClose() { palette.hidden = true; if (pLast && pLast.focus) { pLast.focus(); } }
  function pRun(i) { var c = pItems[i]; if (!c) { return; } pClose(); setTimeout(c.run, 60); }
  $("paletteBtn").addEventListener("click", pOpen);
  palette.addEventListener("mousedown", function (e) { if (e.target === palette) { pClose(); } });
  pInput.addEventListener("input", function () { pIndex = 0; pRender(); });
  pInput.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); pIndex = Math.min(pItems.length - 1, pIndex + 1); pMark(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); pIndex = Math.max(0, pIndex - 1); pMark(); }
    else if (e.key === "Enter") { e.preventDefault(); pRun(pIndex); }
  });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (palette.hidden) { pOpen(); } else { pClose(); } }
    else if (e.key === "Escape" && !palette.hidden) { pClose(); }
  });

  /* ---------- creative layer ---------- */
  // Skills ticker (decorative; the real skills list is above)
  var tickerItems = [];
  (C.skills || []).forEach(function (g) { (g.items || []).filter(show).forEach(function (n) { tickerItems.push(n); }); });
  var track = $("tickerTrack");
  if (tickerItems.length) {
    for (var rep = 0; rep < 2; rep++) { tickerItems.forEach(function (n) { track.appendChild(el("span", { text: n })); }); }
  } else { track.parentNode.hidden = true; }
  if (REDUCED) { track.style.animation = "none"; }

  // Big outlined marquee band between sections
  var bandTrack = $("bandTrack");
  var bandWords = (C.core || []).map(function (c) { return c.name; });
  if (bandWords.length) {
    for (var br = 0; br < 4; br++) { bandWords.forEach(function (w, wi) { bandTrack.appendChild(el("span", { cls: wi % 2 ? "solid" : "", text: w })); }); }
    // The band slides with the scroll position (no timer), looping seamlessly.
    bandTrack.style.animation = "none";
    if (!REDUCED) {
      var bandEl = document.querySelector(".band"), bandHalf = 0, bandTick = false;
      var measureBand = function () { bandHalf = bandTrack.scrollWidth / 2; moveBand(); };
      var moveBand = function () {
        bandTick = false;
        if (!bandHalf) { return; }
        var off = (window.innerHeight - bandEl.getBoundingClientRect().top) * 0.5;
        bandTrack.style.transform = "translate3d(" + (-(((off % bandHalf) + bandHalf) % bandHalf)).toFixed(1) + "px,0,0)";
      };
      window.addEventListener("scroll", function () { if (!bandTick) { bandTick = true; requestAnimationFrame(moveBand); } }, { passive: true });
      window.addEventListener("resize", measureBand);
      window.addEventListener("load", measureBand);
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(measureBand); }
      measureBand();
    }
  } else { bandTrack.parentNode.hidden = true; }

  // Floating badges drift with the cursor
  if (HOVER && !REDUCED) {
    heroEl.addEventListener("pointermove", function (e) {
      var r = heroEl.getBoundingClientRect();
      heroEl.style.setProperty("--tx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      heroEl.style.setProperty("--ty", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    }, { passive: true });
  }

  // Big outlined section numbers behind headings
  document.querySelectorAll(".sec-head").forEach(function (h) {
    var n = h.querySelector(".sec-num");
    if (n) { h.setAttribute("data-n", n.textContent.replace(/\D/g, "")); }
  });

  // Word reveal on headings
  document.querySelectorAll(".sec-head h2, .contact-title").forEach(function (h) {
    var text = h.textContent;
    h.setAttribute("aria-label", text);
    h.textContent = "";
    text.split(" ").forEach(function (w, i, arr) {
      h.appendChild(el("span", { cls: "rw", attrs: { "aria-hidden": "true" } }, [el("span", { text: w, attrs: { style: "--k:" + i } })]));
      if (i < arr.length - 1) { h.appendChild(document.createTextNode(" ")); }
    });
  });

  // Spotlight glow under the cursor
  var spots = document.querySelectorAll(".core-card, .pcard, .mini");
  spots.forEach(function (n) { n.classList.add("spot"); });
  if (HOVER && !REDUCED) {
    document.addEventListener("pointermove", function (e) {
      var t = e.target.closest ? e.target.closest(".spot") : null;
      if (!t) { return; }
      var r = t.getBoundingClientRect();
      t.style.setProperty("--sx", (e.clientX - r.left) + "px");
      t.style.setProperty("--sy", (e.clientY - r.top) + "px");
    }, { passive: true });

    // 3D tilt on project cards
    document.querySelectorAll(".pcard").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform 0.12s ease-out, border-color 0.3s, box-shadow 0.3s";
        card.style.transform = "perspective(1000px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transition = "transform 0.6s var(--ease), border-color 0.3s, box-shadow 0.3s";
        card.style.transform = "";
      });
    });

    // Magnetic buttons
    document.querySelectorAll(".hero-actions .btn, .contact-actions .btn").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.translate = ((e.clientX - (r.left + r.width / 2)) * 0.22).toFixed(1) + "px " + ((e.clientY - (r.top + r.height / 2)) * 0.32).toFixed(1) + "px";
      });
      btn.addEventListener("pointerleave", function () { btn.style.translate = ""; });
    });

    // Cursor follower
    var cur = $("cursor"), cx = 0, cy = 0, tx = 0, ty = 0, curOn = false;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!curOn) { curOn = true; cx = tx; cy = ty; cur.classList.add("show"); requestAnimationFrame(curLoop); }
      cur.classList.toggle("big", !!(e.target.closest && e.target.closest("a, button, .core-card, .pcard, input")));
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { cur.classList.remove("show"); curOn = false; });
    function curLoop() {
      if (!curOn) { return; }
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(curLoop);
    }
  }

  /* ---------- scroll: fades, active nav ---------- */
  var fades = document.querySelectorAll(".fade");
  if ("IntersectionObserver" in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    fades.forEach(function (n) { io.observe(n); });
  } else { fades.forEach(function (n) { n.classList.add("in"); }); }

  if ("IntersectionObserver" in window) {
    var map = {};
    navLinks.querySelectorAll('a[href^="#"]').forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        Object.keys(map).forEach(function (k) { map[k].classList.toggle("active", k === en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).concat(["hero"]).forEach(function (id) { var s = $(id); if (s) { so.observe(s); } });
  }
})();
