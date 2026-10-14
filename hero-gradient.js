/* Interactive gradient behind the hero: a small WebGL shader that drifts slowly and
   leans toward the cursor. Colours come from the --g-* tokens in styles.css, so it
   follows the light/dark theme. Without WebGL, or with reduced motion, the hero keeps
   its plain look (reduced motion still gets one still frame). */
(function () {
  "use strict";

  var hero = document.getElementById("hero");
  var canvas = document.getElementById("heroGl");
  if (!hero || !canvas) { return; }

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SCALE = 0.5; // render at half resolution; the gradient is soft, so this is invisible and much cheaper

  var gl = null;
  try { gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" }); } catch (e) { gl = null; }
  if (!gl) { canvas.remove(); return; }

  var VERT = "attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }";
  var FRAG = [
    "precision mediump float;",
    "uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uHover;",
    "uniform vec3 uBg; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uStrength;",
    "float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float noise(vec2 p) {",
    "  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);",
    "}",
    "float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; } return v; }",
    "void main() {",
    "  vec2 uv = gl_FragCoord.xy / uRes; float asp = uRes.x / uRes.y;",
    "  vec2 p = vec2(uv.x * asp, uv.y); vec2 m = vec2(uMouse.x * asp, uMouse.y);",
    "  float t = uTime * 0.06;",
    "  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 + vec2(5.2, 1.3) - t));",
    "  vec2 w = p + (q - 0.5) * 0.9 + (m - p) * 0.12 * uHover;",
    "  vec2 c1 = vec2(asp * (0.25 + 0.08 * sin(t * 2.1)), 0.72 + 0.08 * cos(t * 1.7));",
    "  vec2 c2 = vec2(asp * (0.78 + 0.07 * cos(t * 1.9)), 0.62 + 0.10 * sin(t * 1.3));",
    "  float f1 = smoothstep(0.85, 0.0, length(w - c1));",
    "  float f2 = smoothstep(0.75, 0.0, length(w - c2));",
    "  float f3 = smoothstep(0.55, 0.0, length(p - m)) * uHover;",
    "  vec3 col = uBg;",
    "  col = mix(col, uA, f1 * uStrength);",
    "  col = mix(col, uB, f2 * uStrength * 0.8);",
    "  col = mix(col, uC, f3 * uStrength * 0.9);",
    "  col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0 * 2.0;", // light grain hides colour banding
    "  gl_FragColor = vec4(col, 1.0);",
    "}",
  ].join("\n");

  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }
  var vs = shader(gl.VERTEX_SHADER, VERT), fs = shader(gl.FRAGMENT_SHADER, FRAG);
  var prog = vs && fs ? gl.createProgram() : null;
  if (prog) { gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); }
  if (!prog || !gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one triangle covers the screen
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var U = {};
  ["uRes", "uTime", "uMouse", "uHover", "uBg", "uA", "uB", "uC", "uStrength"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

  /* ---------- colours from CSS tokens ---------- */
  function rgb(hex) {
    var h = String(hex).trim().replace("#", "");
    if (h.length === 3) { h = h.replace(/./g, "$&$&"); }
    var n = parseInt(h, 16);
    return isNaN(n) || h.length !== 6 ? [0, 0, 0] : [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  }
  function readColours() {
    var cs = getComputedStyle(document.documentElement);
    gl.uniform3fv(U.uBg, rgb(cs.getPropertyValue("--bg")));
    gl.uniform3fv(U.uA, rgb(cs.getPropertyValue("--g-a")));
    gl.uniform3fv(U.uB, rgb(cs.getPropertyValue("--g-b")));
    gl.uniform3fv(U.uC, rgb(cs.getPropertyValue("--g-c")));
    gl.uniform1f(U.uStrength, parseFloat(cs.getPropertyValue("--g-strength")) || 0.3);
  }

  /* ---------- size ---------- */
  function resize() {
    var w = Math.max(1, Math.round(hero.clientWidth * SCALE)), h = Math.max(1, Math.round(hero.clientHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h);
  }

  /* ---------- pointer (smoothed) ---------- */
  var mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, th: 0 };
  hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.width;
    mouse.ty = 1 - (e.clientY - r.top) / r.height; // WebGL's y axis points up
    mouse.th = e.pointerType === "mouse" ? 1 : 0.6;
  });
  hero.addEventListener("pointerleave", function () { mouse.th = 0; });

  /* ---------- loop ---------- */
  var t0 = performance.now(), raf = 0, visible = true, lost = false;
  function draw(now) {
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    mouse.hover += (mouse.th - mouse.hover) * 0.05;
    gl.uniform1f(U.uTime, REDUCED ? 8.0 : (now - t0) / 1000);
    gl.uniform2f(U.uMouse, mouse.x, mouse.y);
    gl.uniform1f(U.uHover, REDUCED ? 0 : mouse.hover);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function frame(now) {
    raf = 0;
    if (lost || !visible || document.hidden) { return; }
    draw(now);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!REDUCED && !raf && !lost) { raf = requestAnimationFrame(frame); } }
  function redraw() { if (!lost) { resize(); draw(performance.now()); } }

  canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); lost = true; hero.classList.remove("has-gl"); canvas.remove(); });

  readColours();
  resize();
  draw(t0);
  hero.classList.add("has-gl");

  window.addEventListener("resize", function () { resize(); if (REDUCED) { redraw(); } });
  new MutationObserver(function () { readColours(); if (REDUCED) { redraw(); } })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  if (REDUCED) { return; } // one still frame, no animation

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) { start(); } }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { start(); } });
  start();
})();
