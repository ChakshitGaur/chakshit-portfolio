/* Interactive dot grid behind the hero: dots lean toward the cursor and light up,
   and a click on empty space sends a ripple through the grid. It replaces the plain
   CSS dots (.dots), which stay as the fallback for reduced motion or no canvas. */
(function () {
  "use strict";

  var hero = document.getElementById("hero");
  var canvas = document.getElementById("heroDots");
  if (!hero || !canvas) { return; }
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext && canvas.getContext("2d");
  if (REDUCED || !ctx) { canvas.remove(); return; }

  var GAP = 28, PULL = 9, RADIUS = 150, RIPPLE_SPEED = 0.55, RIPPLE_LIFE = 1600, RIPPLE_AMP = 7;
  var dpr = 1, w = 0, h = 0, dots = [], colDot = "rgba(20,19,15,.16)", colAcc = [47, 75, 255];
  var mouse = { x: -1e4, y: -1e4, on: false }, ripples = [], raf = 0, visible = true;

  function readColours() {
    var cs = getComputedStyle(document.documentElement);
    colDot = cs.getPropertyValue("--dot").trim() || colDot;
    var hex = cs.getPropertyValue("--accent").trim().replace("#", "");
    if (hex.length === 3) { hex = hex.replace(/./g, "$&$&"); }
    var n = parseInt(hex, 16);
    if (!isNaN(n) && hex.length === 6) { colAcc = [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  }

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    // Same 28px grid and offset as the CSS dots, so switching between them is seamless.
    for (var y = GAP / 2; y < h; y += GAP) {
      for (var x = GAP / 2; x < w; x += GAP) { dots.push({ x: x, y: y, ox: 0, oy: 0, glow: 0 }); }
    }
  }

  function draw(now) {
    raf = 0;
    ctx.clearRect(0, 0, w, h);
    var moving = false;
    ripples = ripples.filter(function (r) { return now - r.t < RIPPLE_LIFE; });
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i], tx = 0, ty = 0, glow = 0;
      if (mouse.on) {
        var dx = mouse.x - d.x, dy = mouse.y - d.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS * 1.6 && dist > 0.01) {
          var f = Math.exp(-(dist * dist) / (RADIUS * RADIUS));
          tx += dx / dist * PULL * f; ty += dy / dist * PULL * f; glow = f;
        }
      }
      for (var k = 0; k < ripples.length; k++) {
        var r = ripples[k], rx = d.x - r.x, ry = d.y - r.y, rd = Math.sqrt(rx * rx + ry * ry) || 1;
        var age = now - r.t, front = age * RIPPLE_SPEED, band = rd - front;
        if (band > -60 && band < 60) {
          var a = Math.cos(band / 60 * Math.PI / 2) * (1 - age / RIPPLE_LIFE);
          tx += rx / rd * RIPPLE_AMP * a; ty += ry / rd * RIPPLE_AMP * a; glow = Math.max(glow, a * 0.9);
        }
      }
      // Ease toward the target so the grid feels springy rather than snapping.
      d.ox += (tx - d.ox) * 0.18; d.oy += (ty - d.oy) * 0.18; d.glow += (glow - d.glow) * 0.18;
      if (Math.abs(tx - d.ox) > 0.05 || Math.abs(ty - d.oy) > 0.05 || Math.abs(glow - d.glow) > 0.01) { moving = true; }
      var px = d.x + d.ox, py = d.y + d.oy;
      if (d.glow > 0.03) {
        ctx.fillStyle = "rgba(" + colAcc[0] + "," + colAcc[1] + "," + colAcc[2] + "," + Math.min(1, 0.25 + d.glow).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(px, py, 1 + d.glow * 1.6, 0, 6.2832); ctx.fill();
      } else {
        ctx.fillStyle = colDot;
        ctx.fillRect(px - 1, py - 1, 2, 2);
      }
    }
    // Keep animating only while something is still moving.
    if ((moving || ripples.length || mouse.on) && visible && !document.hidden) { raf = requestAnimationFrame(draw); }
  }
  function kick() { if (!raf) { raf = requestAnimationFrame(draw); } }

  function local(e) { var r = hero.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  hero.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") { return; }
    var p = local(e); mouse.x = p.x; mouse.y = p.y; mouse.on = true; kick();
  }, { passive: true });
  hero.addEventListener("pointerleave", function () { mouse.on = false; kick(); });
  hero.addEventListener("pointerdown", function (e) {
    // Ripple only from empty space, not from buttons, links or the API card.
    if (e.target.closest && e.target.closest("a, button, .api-card, input, textarea")) { return; }
    var p = local(e);
    ripples.push({ x: p.x, y: p.y, t: performance.now() });
    if (ripples.length > 4) { ripples.shift(); }
    kick();
  });

  var resizeTimer = 0;
  window.addEventListener("resize", function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { build(); kick(); }, 120); });
  if ("ResizeObserver" in window) {
    var lastH = 0, lastW = 0;
    new ResizeObserver(function () { if (hero.clientWidth !== lastW || hero.clientHeight !== lastH) { lastW = hero.clientWidth; lastH = hero.clientHeight; build(); kick(); } }).observe(hero);
  }
  new MutationObserver(function () { readColours(); kick(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) { kick(); } }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { kick(); } });

  readColours();
  build();
  hero.classList.add("has-dots");
  draw(performance.now());
})();
