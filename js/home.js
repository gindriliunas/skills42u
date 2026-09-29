/* Skills 42U — homepage motion
   GSAP + ScrollTrigger + Lenis. Hero plays a scroll-scrubbed frame sequence
   from /assets/box/manifest.json when present, otherwise a CSS-3D box. */
(function () {
  'use strict';

  var doc = document.documentElement;
  document.body.classList.remove('no-js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 720px)').matches;
  if (reduced) document.body.classList.add('reduced');

  /* ─────────────── Injury carousel data ───────────────
     img: /assets/carousel/<file>. board: position of the blank whiteboard
     in that photo as % of the card (x, y, w, h, rotation). */
  var INJURIES = [
    { text: 'Cuts &amp; grazes',   where: 'Office',       file: 'office.webp' },
    { text: 'Back strain',         where: 'Warehouse',    file: 'warehouse.webp' },
    { text: 'Burns &amp; scalds',  where: 'Kitchen',      file: 'chef.webp' },
    { text: 'Falls from height',   where: 'Building site', file: 'construction.webp' },
    { text: 'Fainting',            where: 'Reception',    file: 'reception.webp' },
    { text: 'Slips &amp; trips',   where: 'Retail',       file: 'retail.webp' },
    { text: 'Choking',             where: 'Care home',    file: 'carehome.webp' },
    { text: 'Cardiac arrest',      where: 'Office',       file: 'manager.webp' },
    { text: 'Allergic reaction',   where: 'School',       file: 'school.webp' },
    { text: 'Sprains &amp; strains', where: 'Gym',        file: 'gym.webp' }
  ];
  var BOARDS = {
    'office.webp':       { x: 27, y: 54, w: 50, h: 27, r: 0 },
    'warehouse.webp':    { x: 28, y: 55, w: 46, h: 24, r: 0 },
    'chef.webp':         { x: 25, y: 53, w: 52, h: 27, r: 0 },
    'construction.webp': { x: 23, y: 55, w: 56, h: 28, r: 0 },
    'reception.webp':    { x: 26, y: 49, w: 52, h: 26, r: 0 },
    'retail.webp':       { x: 26, y: 57, w: 50, h: 26, r: 0 },
    'carehome.webp':     { x: 25, y: 53, w: 50, h: 25, r: 0 },
    'manager.webp':      { x: 27, y: 49, w: 48, h: 24, r: 0 },
    'school.webp':       { x: 23, y: 54, w: 56, h: 30, r: 0 },
    'gym.webp':          { x: 27, y: 48, w: 48, h: 23, r: 0 }
  };

  function buildCarousel() {
    var rail = document.getElementById('inj-rail');
    if (!rail) return;
    var html = '';
    for (var pass = 0; pass < 2; pass++) {
      INJURIES.forEach(function (it, i) {
        var b = BOARDS[it.file] || {};
        var style = '--bx:' + (b.x || 22) + '%;--by:' + (b.y || 50) + '%;--bw:' + (b.w || 56) + '%;--bh:' + (b.h || 24) + '%;--br:' + (b.r == null ? -2 : b.r) + 'deg';
        html += '<figure class="inj-card" data-i="' + i + '"' + (pass ? ' aria-hidden="true"' : '') + '>' +
          '<img src="/assets/carousel/' + it.file + '" alt="' + (pass ? '' : 'Worker in a ' + it.where.toLowerCase() + ' holding a whiteboard reading ' + it.text.replace('&amp;', 'and')) + '" loading="lazy" draggable="false" width="880" height="1168">' +
          '<figcaption class="inj-board" style="' + style + '">' + it.text + '</figcaption>' +
          '<div class="inj-meta"><span class="mono">' + String(i + 1).padStart(2, '0') + ' / ' + it.where + '</span></div>' +
          '</figure>';
      });
    }
    rail.innerHTML = html;
    rail.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () { img.parentNode.classList.add('ph'); img.remove(); });
    });

    // drag + inertia + gentle auto-drift, infinite wrap
    var x = 0, v = 0, dragging = false, lastX = 0, lastT = 0, half = 0, hover = false;
    var bar = document.getElementById('inj-bar'), count = document.getElementById('inj-count');
    function measure() { half = rail.scrollWidth / 2; }
    measure(); window.addEventListener('resize', measure);
    rail.addEventListener('pointerdown', function (e) {
      dragging = true; rail.classList.add('dragging'); lastX = e.clientX; lastT = performance.now(); v = 0;
      rail.setPointerCapture(e.pointerId);
    });
    rail.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var now = performance.now(), dx = e.clientX - lastX;
      x += dx; v = dx / Math.max(1, now - lastT) * 16; lastX = e.clientX; lastT = now;
    });
    function end() { dragging = false; rail.classList.remove('dragging'); }
    rail.addEventListener('pointerup', end); rail.addEventListener('pointercancel', end);
    rail.addEventListener('mouseenter', function () { hover = true; });
    rail.addEventListener('mouseleave', function () { hover = false; });
    (function tick() {
      if (!dragging) { x += v; v *= 0.94; if (!reduced && !hover && Math.abs(v) < 0.5) x -= 0.45; }
      if (half) { while (x <= -half) x += half; while (x > 0) x -= half; }
      rail.style.transform = 'translate3d(' + x + 'px,0,0)';
      if (half && bar) {
        var p = -x / half, n = INJURIES.length;
        bar.style.left = (p * 80) + '%';
        count.textContent = String(Math.floor(p * n) % n + 1).padStart(2, '0') + ' / ' + n;
      }
      requestAnimationFrame(tick);
    })();
  }
  buildCarousel();

  /* ─────────────── Nav + mobile call bar ─────────────── */
  var nav = document.getElementById('nav'), mcall = document.getElementById('mcall'), hero = document.getElementById('top');
  function onScroll() {
    var past = window.scrollY > hero.offsetHeight - window.innerHeight * 0.6;
    nav.classList.toggle('solid', past);
    if (mcall) mcall.classList.toggle('show', past);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (typeof gsap === 'undefined' || reduced) {
    // No motion library or reduced motion: show final hero state, reveal everything.
    document.querySelectorAll('.rv').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    if (reduced && hero) {
      hero.style.height = '100vh';
      document.getElementById('hero-final').style.cssText += 'opacity:1;visibility:visible';
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────── Smooth scroll ─────────────── */
  if (typeof Lenis !== 'undefined') {
    var lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var el = document.querySelector(id);
        if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -70, duration: 1.6 }); }
      });
    });
  }

  /* ─────────────── HERO ─────────────── */
  var stage = document.querySelector('.hero-stage');
  var scene = document.getElementById('box3d');
  var inner = document.getElementById('box3d-inner');
  var lid = document.getElementById('b-lid');
  var kits = gsap.utils.toArray('.kit');
  var callouts = gsap.utils.toArray('.callout');
  var canvas = document.getElementById('hero-canvas');
  var ctx = canvas.getContext('2d');
  var sharp = document.createElement('canvas'), sharpCtx = sharp.getContext('2d');

  // Where each item comes to rest, in multiples of box width, relative to box centre.
  var TARGETS = {
    plaster:  { x: -1.05, y: -0.55, r: -18 },
    bandage:  { x: -0.62, y: -1.05, r: 8 },
    gloves:   { x:  0.05, y: -1.25, r: -6 },
    scissors: { x:  0.9,  y: -0.7,  r: 24 },
    coldpack: { x: -1.12, y:  0.35, r: 14 }
  };

  // Where each item rests in the final video frame (fraction of frame width/height) and which side its label sits.
  var VIDEO_POS = {
    bandage:  { x: 0.25, y: 0.20, side: 'l' },
    gloves:   { x: 0.50, y: 0.36, side: 'b' },
    scissors: { x: 0.72, y: 0.30, side: 'r' },
    coldpack: { x: 0.83, y: 0.36, side: 'r' },
    foil:     { x: 0.76, y: 0.55, side: 'r' }
  };

  var frames = [], frameMode = false, lastFrame = -1;
  function drawFrame(i) {
    var img = frames[i];
    if (!img || !img.complete || !img.naturalWidth) return;
    var cw = canvas.width, ch = canvas.height, iw = img.naturalWidth, ih = img.naturalHeight;
    var s = videoScale(cw, ch, iw, ih), w = iw * s, h = ih * s, x = (cw - w) / 2, y = (ch - h) / 2;
    ctx.clearRect(0, 0, cw, ch);
    // Sharp frame with feathered edges; the CSS glow behind the canvas carries the colour past them.
    if (sharp.width !== Math.round(w) || sharp.height !== Math.round(h)) { sharp.width = Math.round(w); sharp.height = Math.round(h); }
    var sw = sharp.width, sh = sharp.height, f = 0.16;
    sharpCtx.globalCompositeOperation = 'source-over';
    sharpCtx.clearRect(0, 0, sw, sh);
    sharpCtx.drawImage(img, 0, 0, sw, sh);
    sharpCtx.globalCompositeOperation = 'destination-in';
    var gx = sharpCtx.createLinearGradient(0, 0, sw, 0);
    gx.addColorStop(0, 'rgba(0,0,0,0)'); gx.addColorStop(f, '#000'); gx.addColorStop(1 - f, '#000'); gx.addColorStop(1, 'rgba(0,0,0,0)');
    sharpCtx.fillStyle = gx; sharpCtx.fillRect(0, 0, sw, sh);
    var gy = sharpCtx.createLinearGradient(0, 0, 0, sh);
    gy.addColorStop(0, 'rgba(0,0,0,0)'); gy.addColorStop(f, '#000'); gy.addColorStop(1 - f, '#000'); gy.addColorStop(1, 'rgba(0,0,0,0)');
    sharpCtx.fillStyle = gy; sharpCtx.fillRect(0, 0, sw, sh);
    ctx.drawImage(sharp, x, y);
    lastFrame = i;
  }
  // Video fits inside the stage (contain) then scales: smaller on desktop to leave room for copy, larger on phones.
  function videoScale(cw, ch, iw, ih) {
    var k = cw / ch < 0.9 ? 1.55 : 0.74;
    return Math.min(cw / iw, ch / ih) * k;
  }
  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = stage.clientWidth * dpr; canvas.height = stage.clientHeight * dpr;
    if (lastFrame >= 0) drawFrame(lastFrame);
  }

  var state = { p: 0 };
  function renderFrames(p) {
    if (!frameMode) return;
    var i = Math.min(frames.length - 1, Math.round(gsap.utils.clamp(0, 1, p / 0.82) * (frames.length - 1)));
    if (i !== lastFrame) {
      // fall back to nearest loaded frame while the sequence streams in
      var j = i; while (j > 0 && !(frames[j] && frames[j].complete)) j--;
      drawFrame(j);
    }
  }

  // Pin each label beside its kit item: the SVG item in fallback mode, the video position in frame mode.
  function placeCallouts() {
    var sr = stage.getBoundingClientRect();
    var f0 = frames[0], iw = f0 && f0.naturalWidth, ih = f0 && f0.naturalHeight;
    var s = frameMode && iw ? videoScale(sr.width, sr.height, iw, ih) : 0;
    callouts.forEach(function (c) {
      var key = c.dataset.for, cx, cy, half, left;
      if (frameMode) {
        var v = VIDEO_POS[key];
        if (!v) { c.style.display = 'none'; return; }
        cx = (sr.width - iw * s) / 2 + v.x * iw * s; cy = (sr.height - ih * s) / 2 + v.y * ih * s;
        half = 0.035 * iw * s; left = v.side === 'l';
      } else {
        var t = TARGETS[key], k = document.querySelector('.kit[data-kit="' + key + '"]');
        if (!t || !k) { c.style.display = 'none'; return; }
        var r = k.getBoundingClientRect();
        cx = r.left - sr.left + r.width / 2; cy = r.top - sr.top + r.height / 2; half = r.width / 2; left = t.x < 0;
      }
      c.style.display = '';
      if (frameMode && VIDEO_POS[key].side === 'b') {
        c.style.top = (cy + 6) + 'px'; c.style.left = (cx - c.offsetWidth / 2) + 'px'; c.style.right = ''; c.style.flexDirection = 'row';
        return;
      }
      c.style.top = (cy - 12) + 'px';
      c.style.left = left ? '' : (cx + half + 10) + 'px';
      c.style.right = left ? (sr.width - cx + half + 10) + 'px' : '';
      c.style.flexDirection = left ? 'row-reverse' : 'row';
    });
  }

  function buildHeroTimeline() {
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onUpdate: function (st) { state.p = st.progress; renderFrames(st.progress); if (st.progress > 0.7) placeCallouts(); } }
    });
    // total timeline length = 1 (maps to scroll progress)
    tl.to('#hero-intro', { autoAlpha: 0, y: -80, duration: 0.08 }, 0.02);
    if (frameMode) tl.fromTo(canvas, { y: function () { return window.innerHeight * 0.2; }, scale: 0.82 }, { y: 0, scale: 1, duration: 0.1, ease: 'power2.out' }, 0.02);
    else tl.fromTo(scene, { y: function () { return window.innerHeight * 0.22; }, scale: 0.8 }, { y: 0, scale: 1, duration: 0.1, ease: 'power2.out' }, 0.02);

    if (!frameMode) {
      gsap.set(inner, { rotationX: -14, rotationY: -28 });
      gsap.set(lid, { rotationX: 90, z: -scene.clientWidth * 0.17 });
      tl.to(inner, { rotationY: 332, duration: 0.56, ease: 'power1.inOut' }, 0.02)
        .to(inner, { rotationX: -22, duration: 0.2 }, 0.5)
        .to(scene, { scale: isMobile ? 0.9 : 0.78, y: isMobile ? 40 : 70, duration: 0.2, ease: 'power2.inOut' }, 0.56)
        .to(lid, { rotationX: 205, duration: 0.14, ease: 'power2.out' }, 0.6);
      kits.forEach(function (k, i) {
        var t = TARGETS[k.dataset.kit]; var w = scene.clientWidth;
        gsap.set(k, { xPercent: -50, yPercent: -50, scale: 0.2, rotation: 0 });
        tl.to(k, { autoAlpha: 1, duration: 0.02 }, 0.66 + i * 0.012)
          .to(k, { x: t.x * w, y: t.y * w, scale: 1, rotation: t.r, duration: 0.16, ease: 'power3.out' }, 0.66 + i * 0.012);
      });
    }

    function chapter(n, a, b) {
      var els = '.chapter[data-ch="' + n + '"]';
      tl.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.05 }, a)
        .to(els, { autoAlpha: 0, y: -40, duration: 0.05 }, b);
    }
    chapter(1, 0.1, 0.24); chapter(2, 0.27, 0.4); chapter(3, 0.43, 0.54);
    tl.to(callouts, { autoAlpha: 1, stagger: 0.012, duration: 0.04 }, 0.7)
      .fromTo('#hero-final', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.86)
      .to({}, { duration: 0.08 }, 0.92);
    return tl;
  }

  function startHero() {
    sizeCanvas(); window.addEventListener('resize', sizeCanvas);
    buildHeroTimeline();
    placeCallouts();
    ScrollTrigger.addEventListener('refresh', placeCallouts);
  }

  // Try the frame sequence; fall back to the CSS box.
  fetch('/assets/box/manifest.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (m) {
      var set = (isMobile && m.mobile) ? m.mobile : m.desktop;
      var n = set.count;
      for (var i = 0; i < n; i++) {
        var img = new Image(); img.decoding = 'async';
        img.src = set.path.replace('{i}', String(i + 1).padStart(3, '0'));
        frames.push(img);
      }
      return new Promise(function (res) {
        frames[0].onload = res; frames[0].onerror = function () { res('fail'); };
      });
    })
    .then(function (r) {
      if (r === 'fail' || !frames.length) throw 0;
      frameMode = true; scene.classList.add('hidden'); canvas.classList.add('ready');
      startHero(); drawFrame(0);
    })
    .catch(function () { frameMode = false; startHero(); });

  /* ─────────────── Statement word reveal ─────────────── */
  var st = document.getElementById('statement');
  if (st) {
    st.innerHTML = st.textContent.split(' ').map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    gsap.to(st.querySelectorAll('.w'), { opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  }

  /* ─────────────── Counters ─────────────── */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var to = +el.dataset.count, suf = el.dataset.suffix || '', o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () {
      gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: function () {
        el.textContent = Math.round(o.v).toLocaleString('en-GB') + suf; } });
    } });
  });

  /* ─────────────── Reveals ─────────────── */
  ScrollTrigger.batch('.rv', {
    start: 'top 88%',
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.08 }); }
  });
  gsap.utils.toArray('.sec-title, .split h2, .contact-side h2, .cta-band h2').forEach(function (h) {
    gsap.from(h, { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });

  /* ─────────────── Parallax ─────────────── */
  gsap.utils.toArray('.parallax').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.utils.toArray('.parallax-bg').forEach(function (bg) {
    gsap.fromTo(bg, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: bg.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ─────────────── Horizontal steps (desktop) ─────────────── */
  ScrollTrigger.matchMedia({
    '(min-width: 721px)': function () {
      var track = document.getElementById('steps-track');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '#how-it-works', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
    }
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
