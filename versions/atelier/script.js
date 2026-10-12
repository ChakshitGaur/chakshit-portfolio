/* Renders the page from content.js. You normally don't need to edit this file. */
(function () {
  "use strict";

  var C = window.CONTENT;
  if (!C) { return; }

  var PREVIEW = /[?&]preview(=|&|$)/.test(location.search);
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ---------- helpers ---------- */
  function isPh(v) { return typeof v === "string" && v.trim().indexOf("[[") === 0; }
  function show(v) { return typeof v === "string" && v.trim() !== "" && (PREVIEW || !isPh(v)); }
  function $(id) { return document.getElementById(id); }

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

  function tagList(items, cls) {
    var list = (items || []).filter(show);
    if (!list.length) { return null; }
    return el("div", { cls: "tags" }, list.map(function (t) {
      var n = el("span", { cls: cls || "tag", text: t });
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

  function reveal(node) { node.classList.add("reveal"); return node; }

  /* ---------- preview banner ---------- */
  if (PREVIEW) {
    document.body.classList.add("preview");
    $("preview-banner").hidden = false;
  }

  document.title = C.name + " | " + C.role.replace(/ · /g, " & ");

  /* ---------- top bar ---------- */
  var logo = $("logo");
  logo.appendChild(document.createTextNode(C.name));
  logo.appendChild(el("i", { text: "." }));

  var resumeLink = $("resumeLink");
  resumeLink.setAttribute("href", C.resumeFile);
  resumeLink.setAttribute("download", C.name.replace(/\s+/g, "") + "_Resume.pdf");

  /* ---------- hero ---------- */
  var H = C.hero || {};
  $("heroGrid").innerHTML = new Array(49).join("<i></i>");

  var tagline = $("tagline");
  (H.tagline || []).forEach(function (t) { tagline.appendChild(el("span", { text: t })); });

  var contact = $("heroContact");
  if (show(C.links.email)) {
    contact.appendChild(link("mailto:" + C.links.email, C.links.email));
  }
  contact.appendChild(el("span", { text: C.location }));
  if (show(C.status)) {
    var st = el("span", { cls: "status-line", text: C.status });
    if (isPh(C.status)) { st.classList.add("ph"); }
    contact.appendChild(st);
  }

  var services = $("services");
  (H.services || []).forEach(function (s) {
    services.appendChild(el("li", {}, [el("span", { cls: "rv", text: s })]));
  });

  var headline = $("headline");
  headline.setAttribute("aria-label", C.role.replace(/ · /g, ", "));
  (H.lines || []).forEach(function (line) {
    headline.appendChild(el("span", { cls: "hl__line", attrs: { "aria-hidden": "true" } }, [
      el("span", { cls: "hl__clip" }, [el("span", { cls: "hl__track", text: line })]),
    ]));
  });

  // Size the headline so the widest line fits the available width.
  function fitHeadline() {
    var tracks = headline.querySelectorAll(".hl__track");
    if (!tracks.length) { return; }
    headline.style.removeProperty("--hl");
    var px = parseFloat(getComputedStyle(headline).fontSize) || 100;
    var widest = 0;
    tracks.forEach(function (t) { widest = Math.max(widest, t.getBoundingClientRect().width); });
    if (!widest) { return; }
    var m = parseFloat(getComputedStyle(root).getPropertyValue("--m")) || 20;
    var avail = Math.min(window.innerWidth - 2 * m, window.innerWidth * 0.94);
    var wanted = (avail / widest) * px;
    if (wanted < px) { headline.style.setProperty("--hl", wanted.toFixed(2) + "px"); }
  }
  fitHeadline();
  window.addEventListener("resize", fitHeadline);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitHeadline); }

  // Cursor parallax on the background glow (skipped for reduced motion / touch).
  var glow = document.querySelector(".hero__glow");
  if (!REDUCED && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("pointermove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 24;
      var y = (e.clientY / window.innerHeight - 0.5) * 16;
      glow.style.setProperty("--px", x.toFixed(1) + "px");
      glow.style.setProperty("--py", y.toFixed(1) + "px");
    }, { passive: true });
  }

  /* ---------- about ---------- */
  var about = $("aboutBody");
  (C.about || []).forEach(function (p) { about.appendChild(el("p", { text: p })); });
  reveal(about);
  $("aboutLoc").textContent = "Based in " + C.location;

  $("stats").append.apply($("stats"), (C.stats || []).map(function (s) {
    return reveal(el("li", {}, [el("strong", { text: s.value }), el("span", { text: s.label })]));
  }));

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
        return el("article", { cls: "mini" }, [
          el("h4", {}, [span(p.name)]),
          el("p", { text: p.text }),
          tagList(p.tags),
        ]);
      })));
    }

    var tags = tagList(job.tags);
    if (tags) { item.appendChild(tags); }

    timeline.appendChild(reveal(item));
  });

  /* ---------- projects ---------- */
  var cards = $("projectCards");
  (C.projects || []).forEach(function (p) {
    if (!show(p.name)) { return; }

    var dl = el("dl");
    [["Problem", p.problem], ["Approach", p.approach]].forEach(function (pair) {
      if (!show(pair[1])) { return; }
      dl.appendChild(el("div", {}, [el("dt", { text: pair[0] }), el("dd", {}, [span(pair[1])])]));
    });

    var plinks = el("div", { cls: "card-links" });
    if (show(p.github)) { plinks.appendChild(link(p.github, "GitHub ↗", "", true)); }
    if (show(p.demo)) { plinks.appendChild(link(p.demo, "Live demo ↗", "", true)); }

    var card = el("article", { cls: "card" }, [
      el("h3", {}, [span(p.name)]),
      dl,
      show(p.metric) ? el("p", { cls: "metric" }, [span(p.metric)]) : null,
      tagList(p.stack),
      plinks.childNodes.length ? plinks : null,
    ]);

    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });

    cards.appendChild(reveal(card));
  });

  /* ---------- skills ---------- */
  var grid = $("skillGrid");
  (C.skills || []).forEach(function (g) {
    var items = (g.items || []).filter(show);
    if (!items.length) { return; }
    grid.appendChild(reveal(el("div", { cls: "skill-box" }, [
      el("h3", { text: g.group }),
      el("div", { cls: "chips" }, items.map(function (i) {
        var c = el("span", { cls: "chip", text: i });
        if (isPh(i)) { c.classList.add("ph"); }
        return c;
      })),
    ])));
  });

  /* ---------- education & certifications ---------- */
  var edu = $("eduList");
  (C.education || []).forEach(function (e) {
    edu.appendChild(reveal(el("li", {}, [
      el("div", {}, [el("h3", { text: e.title }), el("p", { text: e.org })]),
      el("div", { cls: "meta" }, [el("strong", { text: e.score }), document.createTextNode(e.period)]),
    ])));
  });

  var certs = (C.certifications || []).filter(function (c) { return show(c.name); });
  if (certs.length) {
    var cl = $("certList");
    certs.forEach(function (c) {
      var sub = [c.issuer, c.year].filter(show);
      cl.appendChild(reveal(el("li", {}, [
        el("div", {}, [el("h4", {}, [span(c.name)]), sub.length ? el("p", {}, [span(sub.join(" · "))]) : null]),
      ])));
    });
    $("certWrap").hidden = false;
  }

  /* ---------- contact & footer ---------- */
  var actions = $("contactActions");
  if (show(C.links.email)) {
    actions.appendChild(link("mailto:" + C.links.email, "Email me", "btn btn-primary"));
  }
  if (show(C.links.linkedin)) { actions.appendChild(link(C.links.linkedin, "LinkedIn", "btn btn-ghost", true)); }
  if (show(C.links.github)) { actions.appendChild(link(C.links.github, "GitHub", "btn btn-ghost", true)); }
  actions.appendChild(el("a", { cls: "btn btn-ghost", text: "Download resume", attrs: { href: C.resumeFile, download: "" } }));

  $("copy").textContent = "© " + new Date().getFullYear() + " " + C.name + " · " + C.location;

  /* ---------- top bar scroll state + menu ---------- */
  var topbar = $("topbar");
  function onScroll() { topbar.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menuBtn = $("menuBtn");
  var panel = $("menuPanel");
  function setMenu(open) {
    panel.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { panel.querySelector("a").focus(); } else { menuBtn.focus(); }
  }
  menuBtn.addEventListener("click", function () { setMenu(panel.hidden); });
  $("menuClose").addEventListener("click", function () { setMenu(false); });
  panel.addEventListener("click", function (e) { if (e.target.closest("a")) { setMenu(false); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { setMenu(false); } });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (n) { io.observe(n); });
  } else {
    revealEls.forEach(function (n) { n.classList.add("in"); });
  }

  /* ---------- entrance playback ---------- */
  if (root.classList.contains("is-entering")) {
    var finished = false;
    var finish = function () {
      if (finished) { return; }
      finished = true;
      root.classList.remove("is-entering", "is-playing");
      clearTimeout(window.__auFail);
    };
    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
      requestAnimationFrame(function () {
        root.classList.add("is-playing");
        var anims = (document.getAnimations ? document.getAnimations() : []).filter(function (a) {
          return a.animationName && a.animationName.indexOf("au-") === 0;
        });
        Promise.all(anims.map(function (a) { return a.finished.catch(function () {}); })).then(finish);
        setTimeout(finish, 2200);
      });
    });
  }
})();
