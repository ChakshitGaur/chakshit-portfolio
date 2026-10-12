/* Renders the page from content.js. You normally don't need to edit this file. */
(function () {
  "use strict";

  var C = window.CONTENT;
  if (!C) { return; }

  var PREVIEW = /[?&]preview(=|&|$)/.test(location.search);
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    if (opts.attrs) {
      Object.keys(opts.attrs).forEach(function (k) { node.setAttribute(k, opts.attrs[k]); });
    }
    (kids || []).forEach(function (k) { if (k) { node.appendChild(k); } });
    return node;
  }

  // Text wrapper that flags placeholders (only ever visible in preview mode).
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

  function fade(node, d, y) {
    node.classList.add("fade");
    if (d != null) { node.setAttribute("data-d", d); }
    if (y != null) { node.setAttribute("data-y", y); }
    return node;
  }

  if (PREVIEW) {
    document.body.classList.add("preview");
    $("preview-banner").hidden = false;
  }

  document.title = C.name + " | " + C.role.replace(/ · /g, " & ");
  var H = C.hero || {};

  /* ---------- hero text ---------- */
  var title = $("heroTitle");
  title.textContent = H.greeting || "Hi, i’m " + C.name.split(" ")[0].toLowerCase();
  title.setAttribute("aria-label", "Hi, I’m " + C.name + ". " + C.role.replace(/ · /g, ", "));

  /* Hero blurb: the last words scramble from phrase to phrase (static when motion is reduced). */
  var blurb = $("heroBlurb");
  var phrases = (H.rotating || []).filter(function (p) { return typeof p === "string" && p.trim(); });
  var liveEl = null;
  var heroOnScreen = true;
  if (phrases.length > 1 && !REDUCED) {
    var staticLabel = (H.blurbPrefix || "") + " " + phrases.slice(0, -1).join(", ") + " and " + phrases[phrases.length - 1];
    blurb.setAttribute("aria-label", staticLabel.trim());
    blurb.appendChild(el("span", { text: (H.blurbPrefix || "") + " ", attrs: { "aria-hidden": "true" } }));
    liveEl = el("span", { cls: "rot-live", text: phrases[0], attrs: { "aria-hidden": "true" } });
    var rot = el("span", { cls: "rot", attrs: { "aria-hidden": "true" } }, [liveEl]);
    phrases.forEach(function (p) { rot.appendChild(el("span", { cls: "rot-size", text: p })); });
    blurb.appendChild(rot);
  } else {
    blurb.textContent = H.blurb || "";
  }

  function scrambleTo(node, from, to, done) {
    var glyphs = "!<>-_\\/[]{}—=+*^?#";
    var len = Math.max(from.length, to.length), queue = [], frame = 0;
    for (var i = 0; i < len; i++) {
      var start = Math.floor(Math.random() * 16);
      queue.push({ from: from[i] || "", to: to[i] || "", start: start, end: start + 10 + Math.floor(Math.random() * 16), ch: "" });
    }
    (function tick() {
      var out = "", complete = 0;
      queue.forEach(function (q) {
        if (frame >= q.end) { complete++; out += q.to; }
        else if (frame >= q.start) {
          if (!q.ch || Math.random() < 0.28) { q.ch = glyphs[Math.floor(Math.random() * glyphs.length)]; }
          out += q.ch;
        } else { out += q.from; }
      });
      node.textContent = out;
      if (complete === queue.length) { done(); } else { frame++; requestAnimationFrame(tick); }
    })();
  }

  if (liveEl) {
    var phraseIdx = 0;
    var cycle = function () {
      if (document.hidden || !heroOnScreen) { setTimeout(cycle, 600); return; }
      var next = (phraseIdx + 1) % phrases.length;
      scrambleTo(liveEl, phrases[phraseIdx], phrases[next], function () {
        phraseIdx = next;
        setTimeout(cycle, 2600);
      });
    };
    setTimeout(cycle, 2600);
  }

  // Size the heading so it spans the full width on one line.
  function fitTitle() {
    title.style.removeProperty("font-size");
    var px = parseFloat(getComputedStyle(title).fontSize) || 100;
    var holder = title.parentElement;
    var cs = getComputedStyle(holder);
    var avail = holder.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var probe = el("span", { text: title.textContent });
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;text-transform:uppercase;font-weight:900;letter-spacing:-0.025em;font-family:inherit;font-size:" + px + "px";
    document.body.appendChild(probe);
    var w = probe.getBoundingClientRect().width;
    document.body.removeChild(probe);
    if (w > avail && w > 0) { title.style.fontSize = (px * avail / w).toFixed(2) + "px"; }
  }
  fitTitle();
  window.addEventListener("resize", fitTitle);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitTitle); }

  /* ---------- skills marquee ---------- */
  var skillTiles = [];
  (C.skills || []).forEach(function (g) {
    (g.items || []).filter(show).forEach(function (name) { skillTiles.push({ group: g.group, name: name }); });
  });
  var half = Math.ceil(skillTiles.length / 2);
  var rowsData = [skillTiles.slice(0, half), skillTiles.slice(half)];
  var rows = [$("row1"), $("row2")];

  rows.forEach(function (row, idx) {
    var data = rowsData[idx];
    if (!data.length) { row.hidden = true; return; }
    for (var rep = 0; rep < 3; rep++) {
      data.forEach(function (s) {
        var t = el("div", { cls: "tile" }, [el("small", { text: s.group }), el("strong", { text: s.name })]);
        if (rep) { t.setAttribute("aria-hidden", "true"); }
        row.appendChild(t);
      });
    }
  });

  var setW = [0, 0];
  function measureRows() {
    rows.forEach(function (row, i) {
      if (row.hidden) { return; }
      setW[i] = row.scrollWidth / 3;
      row.style.left = -setW[i] + "px";
    });
  }

  /* ---------- about (scroll-driven character reveal) ---------- */
  var aboutText = $("aboutText");
  var aboutChars = [];
  (function () {
    var full = (C.about || []).join(" ");
    full.split(" ").forEach(function (word, wi, arr) {
      var w = el("span", { cls: "w" });
      word.split("").forEach(function (ch) {
        var c = el("span", { cls: "c", text: ch });
        w.appendChild(c);
        aboutChars.push({ node: c, o: -1 });
      });
      aboutText.appendChild(w);
      if (wi < arr.length - 1) { aboutText.appendChild(document.createTextNode(" ")); }
    });
    aboutText.setAttribute("aria-label", full);
  })();

  /* ---------- stats (count up when scrolled into view) ---------- */
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
  (C.stats || []).forEach(function (s, i) {
    var strong = el("strong", { text: s.value });
    var parsed = parseStat(s.value);
    if (parsed && !REDUCED) {
      strong.setAttribute("aria-label", s.value);
      strong.textContent = fmtStat(parsed, 0);
      counters.push({ node: strong, p: parsed });
    }
    statsEl.appendChild(fade(el("li", {}, [strong, el("span", { text: s.label })]), i * 0.1));
  });
  function runCounter(c) {
    var t0 = null, dur = 1400;
    (function step(ts) {
      if (t0 === null) { t0 = ts; }
      var k = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
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
    } else {
      counters.forEach(function (c) { c.node.textContent = fmtStat(c.p, c.p.num); });
    }
  }

  /* ---------- terminal (types itself when scrolled into view) ---------- */
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

  var caret = el("span", { cls: "caret" });
  // Draw the first n characters of a row; the rest stays invisible so the box never changes size.
  function drawRow(r, n) {
    r.body.textContent = "";
    var left = n;
    var rest = "";
    r.tokens.forEach(function (t) {
      if (left >= t.s.length) {
        left -= t.s.length;
        r.body.appendChild(el("span", { cls: t.c, text: t.s }));
      } else if (left > 0) {
        r.body.appendChild(el("span", { cls: t.c, text: t.s.slice(0, left) }));
        rest += t.s.slice(left);
        left = 0;
      } else { rest += t.s; }
    });
    if (n < r.len || r.showCaret) { r.body.appendChild(caret); }
    if (rest) { r.body.appendChild(el("span", { cls: "ghost", text: rest })); }
  }
  termRows.forEach(function (r) { drawRow(r, REDUCED ? r.len : 0); });

  function typeTerminal() {
    var ri = 0;
    (function nextRow() {
      if (ri >= termRows.length) { termRows[termRows.length - 1].showCaret = true; drawRow(termRows[termRows.length - 1], termRows[termRows.length - 1].len); return; }
      var r = termRows[ri], n = 0;
      var speed = r.kind === "cmd" ? 55 : 14;
      if (r.kind === "out") {
        setTimeout(function () { drawRow(r, r.len); ri++; setTimeout(nextRow, 120); }, 450);
        return;
      }
      (function typeChar() {
        n++;
        drawRow(r, n);
        if (n < r.len) { setTimeout(typeChar, speed); }
        else { r.showCaret = false; drawRow(r, r.len); ri++; setTimeout(nextRow, r.kind === "cmd" ? 380 : 90); }
      })();
    })();
  }
  if (termRows.length && !REDUCED) {
    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { tio.disconnect(); typeTerminal(); }
      }, { threshold: 0.5 });
      tio.observe($("term"));
    } else { termRows.forEach(function (r) { drawRow(r, r.len); }); }
  }

  /* ---------- services ---------- */
  var svcList = $("svcList");
  (C.services || []).forEach(function (s, i) {
    svcList.appendChild(fade(el("li", { cls: "svc" }, [
      el("span", { cls: "num", text: pad2(i + 1) }),
      el("div", {}, [el("h3", { text: s.name }), el("p", { text: s.text })]),
    ]), i * 0.1));
  });

  /* ---------- experience ---------- */
  var timeline = $("timeline");
  (C.experience || []).forEach(function (job) {
    if (!show(job.title)) { return; }

    var meta = [job.org, job.location].filter(show);
    var orgLine = el("p", { cls: "tl-org" });
    meta.forEach(function (m, i) {
      if (i) { orgLine.appendChild(document.createTextNode(" · ")); }
      orgLine.appendChild(span(m));
    });

    var head = el("div", { cls: "tl-head" }, [
      el("h3", {}, [span(job.title)]),
      show(job.period) ? span(job.period, "tl-period") : null,
    ]);

    var item = el("li", { cls: "tl-item" }, [head, meta.length ? orgLine : null]);

    var bullets = (job.bullets || []).filter(show);
    if (bullets.length) {
      item.appendChild(el("ul", { cls: "tl-bullets" }, bullets.map(function (b) { return el("li", {}, [span(b)]); })));
    }

    var projects = (job.projects || []).filter(function (p) { return show(p.name); });
    if (projects.length) {
      item.appendChild(el("div", { cls: "mini-grid" }, projects.map(function (p) {
        return el("article", { cls: "mini" }, [el("h4", {}, [span(p.name)]), el("p", { text: p.text }), tagList(p.tags)]);
      })));
    }

    var tags = tagList(job.tags);
    if (tags) { item.appendChild(tags); }
    timeline.appendChild(fade(item));
  });

  /* ---------- projects (sticky stacking cards) ---------- */
  var stack = $("stack");
  var cardScales = [];
  var projectList = (C.projects || []).filter(function (p) { return show(p.name); });
  projectList.forEach(function (p, i) {
    var plinks = el("div", { cls: "pcard-links" });
    if (show(p.demo)) { plinks.appendChild(link(p.demo, "Live Project", "ghost-btn", true)); }
    if (show(p.github)) { plinks.appendChild(link(p.github, "GitHub", "ghost-btn", true)); }

    var left = el("div", { cls: "pcol" }, [
      el("div", { cls: "panel p1" }, [el("small", { text: "Problem" }), el("p", {}, [span(p.problem || "")])]),
      el("div", { cls: "panel p2" }, [el("small", { text: "Approach" }), el("p", {}, [span(p.approach || "")])]),
    ]);

    var right = el("div", { cls: "panel p3" }, [
      el("div", {}, [el("small", { text: "Built with" }), tagList(p.stack)]),
      el("div", {}, [
        el("span", { cls: "big", text: show(p.category) ? p.category : p.name }),
        show(p.metric) ? el("p", { cls: "metric" }, [span(p.metric)]) : null,
      ]),
    ]);

    var card = el("article", { cls: "pcard" }, [
      el("div", { cls: "pcard-top" }, [
        el("span", { cls: "num", text: pad2(i + 1) }),
        el("div", { cls: "pcard-title" }, [
          show(p.category) ? el("small", {}, [span(p.category)]) : null,
          el("h3", {}, [span(p.name)]),
        ]),
        plinks.childNodes.length ? plinks : null,
      ]),
      el("div", { cls: "pgrid" }, [left, right]),
    ]);

    var scaleWrap = el("div", { cls: "stack-scale" }, [card]);
    var sticky = el("div", { cls: "stack-card", attrs: { style: "--i:" + i } }, [scaleWrap]);
    stack.appendChild(el("div", { cls: "stack-item" }, [sticky]));
    cardScales.push(scaleWrap);
  });
  if (!projectList.length) { $("projects").hidden = true; }

  /* ---------- education & certifications ---------- */
  var edu = $("eduList");
  (C.education || []).forEach(function (e, i) {
    edu.appendChild(fade(el("li", {}, [
      el("div", {}, [el("h3", { text: e.title }), el("p", { text: e.org })]),
      el("span", { cls: "meta", text: e.period }),
    ]), i * 0.08));
  });

  var certs = (C.certifications || []).filter(function (c) { return show(c.name); });
  if (certs.length) {
    var cl = $("certList");
    certs.forEach(function (c) {
      var sub = [c.issuer, c.year].filter(show);
      cl.appendChild(fade(el("li", {}, [
        el("div", {}, [el("h4", {}, [span(c.name)]), sub.length ? el("p", {}, [span(sub.join(" · "))]) : null]),
      ])));
    });
    $("certWrap").hidden = false;
  }

  /* ---------- contact & footer ---------- */
  var actions = $("contactActions");
  if (show(C.links.email)) { actions.appendChild(link("mailto:" + C.links.email, "Email me", "contact-btn")); }
  if (show(C.links.linkedin)) { actions.appendChild(link(C.links.linkedin, "LinkedIn", "ghost-btn", true)); }
  if (show(C.links.github)) { actions.appendChild(link(C.links.github, "GitHub", "ghost-btn", true)); }
  actions.appendChild(el("a", { cls: "ghost-btn", text: "Resume", attrs: { href: C.resumeFile, download: C.name.replace(/\s+/g, "") + "_Resume.pdf" } }));
  if (show(C.status)) {
    var st = el("p", { cls: "contact-lead", text: C.status });
    if (isPh(C.status)) { st.classList.add("ph"); }
    actions.parentNode.insertBefore(st, actions);
  }
  $("copy").textContent = "© " + new Date().getFullYear() + " " + C.name + " · " + C.location;

  /* ---------- fade-in on scroll (reads data-* attributes) ---------- */
  var fades = document.querySelectorAll(".fade");
  fades.forEach(function (n) {
    var x = n.getAttribute("data-x"), y = n.getAttribute("data-y"), d = n.getAttribute("data-d"), t = n.getAttribute("data-t");
    if (x != null) { n.style.setProperty("--x", x + "px"); }
    if (y != null) { n.style.setProperty("--y", y + "px"); }
    if (d != null) { n.style.setProperty("--d", d + "s"); }
    if (t != null) { n.style.setProperty("--t", t + "s"); }
  });
  if ("IntersectionObserver" in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: "50px 0px 50px 0px" });
    fades.forEach(function (n) { io.observe(n); });
    // The hero is always on screen at load, so reveal it right away.
    setTimeout(function () {
      document.querySelectorAll(".hero .fade").forEach(function (n) { n.classList.add("in"); });
    }, 60);
  } else {
    fades.forEach(function (n) { n.classList.add("in"); });
  }

  /* ---------- flowing gradient background (WebGL shader) ---------- */
  var flowCanvas = $("flow");
  var flowVisible = true;
  var flow = (function () {
    var gl = flowCanvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }) ||
             flowCanvas.getContext("experimental-webgl");
    if (!gl) { return null; }

    var vsSrc = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
    var fsSrc = [
      "precision mediump float;",
      "uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse;",
      "void main(){",
      "  vec2 uv = gl_FragCoord.xy / uRes;",
      "  float asp = uRes.x / uRes.y;",
      "  vec2 p = (uv - 0.5) * vec2(asp, 1.0);",
      "  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);",
      "  float t = uTime * 0.05;",
      "  vec2 q = p * 1.5;",
      "  for (int i = 1; i < 5; i++) {",
      "    float fi = float(i);",
      "    q += (0.5 / fi) * vec2(sin(q.y * fi * 1.7 + t * fi + 1.3), cos(q.x * fi * 1.5 - t * fi * 0.8));",
      "  }",
      "  float d = length(p - m);",
      "  q += (p - m) * exp(-d * 3.2) * 0.4;",
      "  float f = 0.5 + 0.5 * sin(q.x * 1.8 + q.y * 1.2 + t * 3.0);",
      "  float g = 0.5 + 0.5 * sin(q.y * 2.1 - q.x * 0.9 - t * 2.0);",
      "  vec3 base = vec3(0.047);",
      "  vec3 purple = vec3(0.46, 0.13, 0.69);",
      "  vec3 magenta = vec3(0.71, 0.0, 0.66);",
      "  vec3 orange = vec3(0.75, 0.30, 0.0);",
      "  vec3 blue = vec3(0.12, 0.37, 0.66);",
      "  vec3 col = mix(base, purple, smoothstep(0.15, 0.95, f) * 0.85);",
      "  col = mix(col, magenta, smoothstep(0.55, 1.0, g) * f * 0.75);",
      "  col = mix(col, orange, smoothstep(0.72, 1.0, f * g) * 0.85);",
      "  col = mix(col, blue, smoothstep(0.6, 1.0, 1.0 - f) * g * 0.35);",
      "  col *= 0.42;",
      "  float edge = smoothstep(0.0, 0.32, uv.y);",
      "  col = mix(base, col, edge);",
      "  float vig = smoothstep(1.25, 0.25, length(p * vec2(0.8, 1.1)));",
      "  col = mix(base, col, 0.35 + 0.65 * vig);",
      "  float n = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);",
      "  col += (n - 0.5) * 0.03;",
      "  gl_FragColor = vec4(col, 1.0);",
      "}"
    ].join("\n");

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    var vs = compile(gl.VERTEX_SHADER, vsSrc), fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) { return null; }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { return null; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, "uRes");
    var uTime = gl.getUniformLocation(prog, "uTime");
    var uMouse = gl.getUniformLocation(prog, "uMouse");
    return { gl: gl, uRes: uRes, uTime: uTime, uMouse: uMouse };
  })();

  if (!flow) {
    // No WebGL: fall back to a static CSS gradient.
    flowCanvas.hidden = true;
    document.querySelector(".hero").classList.add("hero-fallback");
  } else {
    var mouse = { x: 0.5, y: 0.6, tx: 0.5, ty: 0.6 };
    var hasHover = window.matchMedia("(hover: hover)").matches;
    var t0 = performance.now(), flowRaf = 0;

    var sizeFlow = function () {
      var r = flowCanvas.getBoundingClientRect();
      var scale = Math.min(window.devicePixelRatio || 1, 1.25) * 0.6;
      flowCanvas.width = Math.max(2, Math.round(r.width * scale));
      flowCanvas.height = Math.max(2, Math.round(r.height * scale));
      flow.gl.viewport(0, 0, flowCanvas.width, flowCanvas.height);
    };
    var drawFlow = function (time) {
      var tt = REDUCED ? 14 : time;
      if (!hasHover || REDUCED) {
        // No cursor (touch): let the light drift on its own path.
        mouse.tx = 0.5 + 0.28 * Math.sin(tt * 0.18);
        mouse.ty = 0.6 + 0.2 * Math.cos(tt * 0.23);
      }
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      flow.gl.uniform2f(flow.uRes, flowCanvas.width, flowCanvas.height);
      flow.gl.uniform1f(flow.uTime, tt);
      flow.gl.uniform2f(flow.uMouse, mouse.x, mouse.y);
      flow.gl.drawArrays(flow.gl.TRIANGLE_STRIP, 0, 4);
    };
    var flowLoop = function () {
      drawFlow((performance.now() - t0) / 1000);
      flowRaf = requestAnimationFrame(flowLoop);
    };
    var startFlow = function () { if (!flowRaf && !REDUCED && flowVisible && !document.hidden) { flowRaf = requestAnimationFrame(flowLoop); } };
    var stopFlow = function () { if (flowRaf) { cancelAnimationFrame(flowRaf); flowRaf = 0; } };

    sizeFlow();
    drawFlow(0);
    window.addEventListener("resize", function () { sizeFlow(); drawFlow((performance.now() - t0) / 1000); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        flowVisible = en[0].isIntersecting;
        heroOnScreen = flowVisible;
        if (flowVisible) { startFlow(); } else { stopFlow(); }
      }).observe(flowCanvas);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) { stopFlow(); } else { startFlow(); } });
    if (hasHover && !REDUCED) {
      window.addEventListener("pointermove", function (e) {
        var r = flowCanvas.getBoundingClientRect();
        mouse.tx = clamp((e.clientX - r.left) / r.width, 0, 1);
        mouse.ty = clamp(1 - (e.clientY - r.top) / r.height, 0, 1);
      }, { passive: true });
    }
    startFlow();
  }

  /* ---------- scroll-driven effects (one rAF-throttled handler) ---------- */
  var dock = $("dock");
  var marquee = $("marquee");
  var ticking = false;

  function scrollFx() {
    ticking = false;
    var vh = window.innerHeight, sy = window.scrollY;

    dock.classList.toggle("show", sy > vh * 0.7);

    // Marquee: row 1 moves right, row 2 moves left, looping seamlessly.
    var top = marquee.getBoundingClientRect().top + sy;
    var offset = (sy - top + vh) * 0.3;
    [0, 1].forEach(function (i) {
      if (rows[i].hidden || !setW[i]) { return; }
      var v = (offset - 200) % setW[i];
      if (v < 0) { v += setW[i]; }
      rows[i].style.transform = "translate3d(" + (i === 0 ? v : -v).toFixed(1) + "px,0,0)";
    });

    // About text: each character fades 0.2 -> 1 as you scroll through the paragraph.
    if (!REDUCED) {
      var r = aboutText.getBoundingClientRect();
      var p = clamp((vh * 0.8 - r.top) / (vh * 0.6 + r.height), 0, 1);
      var n = aboutChars.length;
      for (var k = 0; k < n; k++) {
        var a = k / n, b = (k + 1) / n;
        var o = 0.2 + 0.8 * clamp((p - a) / (b - a), 0, 1);
        if (Math.abs(o - aboutChars[k].o) > 0.01) { aboutChars[k].node.style.opacity = o.toFixed(2); aboutChars[k].o = o; }
      }
    }

    // Project cards: earlier cards scale down as later ones stack on top.
    var count = cardScales.length;
    if (count) {
      var sr = stack.getBoundingClientRect();
      var prog = clamp((-sr.top) / Math.max(1, sr.height - vh), 0, 1);
      cardScales.forEach(function (node, idx) {
        var target = 1 - (count - 1 - idx) * 0.03;
        var start = idx * 0.25;
        var t = clamp((prog - start) / (1 - start), 0, 1);
        node.style.transform = "scale(" + (1 + (target - 1) * t).toFixed(4) + ")";
      });
    }
  }
  function requestFx() { if (!ticking) { ticking = true; requestAnimationFrame(scrollFx); } }
  window.addEventListener("scroll", requestFx, { passive: true });
  window.addEventListener("resize", function () { measureRows(); requestFx(); });

  measureRows();
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { measureRows(); requestFx(); }); }
  window.addEventListener("load", function () { measureRows(); requestFx(); });
  scrollFx();
})();
