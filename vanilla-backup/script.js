/* ==========================================================================
   Apple-style scroll engine — no libraries.
   Scroll position drives every "frame": particle morphs, word reveals,
   and the horizontal work gallery.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }; // easeInOutQuad

  /* ---------- scroll-in reveals (about / contact) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- statement: split into word spans ---------- */
  var statementEl = document.getElementById('statement');
  var words = [];
  if (statementEl) {
    var text = statementEl.textContent.trim().split(/\s+/);
    statementEl.textContent = '';
    text.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'w' + (reduced ? ' on' : '');
      span.textContent = w;
      statementEl.appendChild(span);
      if (i < text.length - 1) statementEl.appendChild(document.createTextNode(' '));
      words.push(span);
    });
  }

  /* ---------- particle scrub section ---------- */
  var canvas = document.getElementById('particles');
  var scrubSection = document.getElementById('scrub');
  var captions = document.querySelectorAll('.scrub-caption');
  var ctx = canvas ? canvas.getContext('2d') : null;

  var W = 0, H = 0, DPR = 1;
  var COUNT = 0;
  var particles = [];   // {x, y, hue}  current positions
  var shapeA = [];      // "DESIGN" points
  var shapeB = [];      // "BUILD" points
  var fib = [];         // unit sphere points
  var sphereR = 0;

  var COLORS = ['#f5f5f7', '#f5f5f7', '#f5f5f7', '#f5f5f7', '#f5f5f7', '#f5f5f7', '#2997ff', '#2997ff', '#bf5af2', '#64d2ff'];

  function sampleText(word, count, w, h) {
    var off = document.createElement('canvas');
    off.width = Math.max(2, Math.floor(w));
    off.height = Math.max(2, Math.floor(h));
    var c = off.getContext('2d', { willReadFrequently: true });
    var size = h * 0.42;
    var font = '800 ' + size + 'px ' + '-apple-system, "Segoe UI", Roboto, sans-serif';
    c.font = font;
    var tw = c.measureText(word).width;
    if (tw > w * 0.92) { size *= (w * 0.92) / tw; c.font = '800 ' + size + 'px -apple-system, "Segoe UI", Roboto, sans-serif'; }
    c.fillStyle = '#fff';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(word, off.width / 2, off.height / 2);

    var data = c.getImageData(0, 0, off.width, off.height).data;
    var pts = [];
    var step = 3;
    for (var y = 0; y < off.height; y += step) {
      for (var x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 128) {
          pts.push({ x: x - off.width / 2, y: y - off.height / 2, z: 0 });
        }
      }
    }
    if (!pts.length) pts.push({ x: 0, y: 0, z: 0 });
    var out = new Array(count);
    for (var i = 0; i < count; i++) out[i] = pts[Math.floor(i * pts.length / count)];
    return out;
  }

  function buildSphere(count) {
    var pts = new Array(count);
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < count; i++) {
      var y = count > 1 ? 1 - (i / (count - 1)) * 2 : 0;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = golden * i;
      pts[i] = { x: Math.cos(th) * r, y: y, z: Math.sin(th) * r };
    }
    return pts;
  }

  function spherePoint(i, t, p) {
    var b = fib[i];
    var tilt = 0.42;
    // tilt around X, then spin around Y (time + scroll progress)
    var y1 = b.y * Math.cos(tilt) - b.z * Math.sin(tilt);
    var z1 = b.y * Math.sin(tilt) + b.z * Math.cos(tilt);
    var a = t * 0.00035 + p * 3.5;
    var cos = Math.cos(a), sin = Math.sin(a);
    return {
      x: (b.x * cos + z1 * sin) * sphereR,
      y: y1 * sphereR,
      z: (-b.x * sin + z1 * cos) * sphereR
    };
  }

  // scroll timeline: which shapes to blend at progress p
  var SEGMENTS = [
    { from: 0.00, to: 0.18, a: 'A', b: 'A' },
    { from: 0.18, to: 0.42, a: 'A', b: 'S' },
    { from: 0.42, to: 0.58, a: 'S', b: 'S' },
    { from: 0.58, to: 0.82, a: 'S', b: 'B' },
    { from: 0.82, to: 1.01, a: 'B', b: 'B' }
  ];

  function shapePoint(kind, i, t, p) {
    if (kind === 'A') return shapeA[i];
    if (kind === 'B') return shapeB[i];
    return spherePoint(i, t, p);
  }

  function setupCanvas() {
    if (!canvas) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    COUNT = clamp(Math.floor(W * H / 900), 900, 2200);
    sphereR = Math.min(W, H) * 0.30;
    fib = buildSphere(COUNT);
    shapeA = sampleText('DESIGN', COUNT, W * 0.92, H * 0.6);
    shapeB = sampleText('BUILD', COUNT, W * 0.92, H * 0.6);

    if (particles.length !== COUNT) {
      particles = new Array(COUNT);
      for (var i = 0; i < COUNT; i++) {
        particles[i] = {
          x: (Math.random() - 0.5) * W,
          y: (Math.random() - 0.5) * H,
          color: COLORS[i % COLORS.length],
          phase: Math.random() * Math.PI * 2
        };
      }
    }
  }

  function drawScrub(p, t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = clamp(p * 25, 0.15, 1); // quick fade-in as the section arrives

    var seg = SEGMENTS[0];
    for (var s = 0; s < SEGMENTS.length; s++) {
      if (p >= SEGMENTS[s].from && p < SEGMENTS[s].to) { seg = SEGMENTS[s]; break; }
      if (p >= SEGMENTS[s].to) seg = SEGMENTS[s];
    }
    var u = seg.to > seg.from ? ease(clamp((p - seg.from) / (seg.to - seg.from), 0, 1)) : 0;

    var cx = W / 2, cy = H / 2;
    var fov = 900;

    for (var i = 0; i < COUNT; i++) {
      var pt = particles[i];
      var A = shapePoint(seg.a, i, t, p);
      var B = shapePoint(seg.b, i, t, p);
      var tx = lerp(A.x, B.x, u);
      var ty = lerp(A.y, B.y, u);
      var tz = lerp(A.z || 0, B.z || 0, u);

      // particles chase their target — organic formation + smooth morphs
      pt.x = lerp(pt.x, tx, 0.16);
      pt.y = lerp(pt.y, ty, 0.16);

      var persp = fov / (fov + tz);
      var wob = Math.sin(t * 0.0012 + pt.phase) * 1.4;

      var size = 1.5 * persp;
      ctx.globalAlpha = clamp(p * 25, 0.15, 1) * clamp(0.25 + 0.75 * persp, 0, 1);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(cx + (pt.x + wob) * persp, cy + (pt.y + wob * 0.6) * persp, size, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawCaptions(p) {
    var centers = [0.09, 0.5, 0.91];
    for (var i = 0; i < captions.length; i++) {
      var o = clamp(1 - Math.abs(p - centers[i]) / 0.09, 0, 1);
      captions[i].style.opacity = o.toFixed(3);
      captions[i].style.transform = 'translateY(' + ((1 - o) * 14).toFixed(1) + 'px)';
    }
  }

  /* ---------- pinned-section progress helper ---------- */
  function pinProgress(section) {
    var rect = section.getBoundingClientRect();
    var total = section.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    return clamp(-rect.top / total, 0, 1);
  }

  /* ---------- horizontal work gallery ---------- */
  var workSection = document.getElementById('work') ? document.querySelector('.work') : null;
  var workTrack = document.getElementById('workTrack');
  var workShift = 0;

  function setupWork() {
    if (!workTrack || !workSection || reduced) return;
    workTrack.style.transform = 'none';
    workShift = Math.max(0, workTrack.scrollWidth - window.innerWidth);
    workSection.style.height = (window.innerHeight + workShift) + 'px';
  }

  /* ---------- hero ---------- */
  var heroInner = document.getElementById('heroInner');
  var scrollCue = document.getElementById('scrollCue');

  /* ---------- main loop: one place reads scroll, everything follows ---------- */
  var statementSection = document.querySelector('.statement');
  var smooth = { scrub: 0, work: 0, statement: 0 };
  var lastWordCount = -1;

  function frame(t) {
    var vh = window.innerHeight;

    // hero fade/scale
    if (heroInner) {
      var hp = clamp(window.scrollY / vh, 0, 1);
      heroInner.style.opacity = clamp(1 - hp * 1.35, 0, 1).toFixed(3);
      heroInner.style.transform = 'translateY(' + (-46 * hp).toFixed(1) + 'px) scale(' + (1 - 0.1 * hp).toFixed(4) + ')';
      if (scrollCue) scrollCue.style.opacity = clamp(1 - hp * 3, 0, 1).toFixed(3);
    }

    // particle scrub — only render while on screen
    if (canvas && scrubSection) {
      var rect = scrubSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        smooth.scrub = lerp(smooth.scrub, pinProgress(scrubSection), 0.12);
        drawScrub(smooth.scrub, t);
        drawCaptions(smooth.scrub);
      }
    }

    // statement words
    if (statementSection && words.length) {
      var sp = pinProgress(statementSection);
      var count = Math.round(clamp(sp * 1.08, 0, 1) * words.length);
      if (count !== lastWordCount) {
        for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < count);
        lastWordCount = count;
      }
    }

    // horizontal gallery
    if (workTrack && workShift > 0) {
      var wr = workSection.getBoundingClientRect();
      if (wr.bottom > 0 && wr.top < vh) {
        var target = -pinProgress(workSection) * workShift;
        smooth.work = lerp(smooth.work, target, 0.12);
        workTrack.style.transform = 'translate3d(' + smooth.work.toFixed(1) + 'px,0,0)';
      }
    }

    requestAnimationFrame(frame);
  }

  /* ---------- boot ---------- */
  function init() {
    setupCanvas();
    setupWork();
    if (reduced) {
      // static fallback: run the chase a few times so particles settle into the sphere
      if (ctx) { for (var k = 0; k < 40; k++) drawScrub(0.5, 0); }
      return;
    }
    requestAnimationFrame(frame);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setupCanvas();
      setupWork();
      if (reduced && ctx) { for (var k = 0; k < 40; k++) drawScrub(0.5, 0); }
    }, 150);
  });

  init();
})();
