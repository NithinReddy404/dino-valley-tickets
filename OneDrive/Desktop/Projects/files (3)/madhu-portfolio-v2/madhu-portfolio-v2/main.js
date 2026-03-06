/* ============================================================
   MADHU KRISHNA TEJA JANASWAMY — AEROSPACE PORTFOLIO
   main.js — Bright Day Sky · Fluffy Clouds · Flying Aircraft
   ============================================================ */

'use strict';

// ── THREE.JS SKY SCENE ────────────────────────────────────────
(function initSkyScene() {
  const canvas = document.getElementById('sky-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  // ── RENDERER ──
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.setClearColor(0x87ceeb);

  // ── SCENE & CAMERA ──
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.FogExp2(0xb8dff5, 0.0008);

  const camera = new THREE.PerspectiveCamera(65, W() / H(), 0.1, 3000);
  camera.position.set(0, 0, 120);

  // ── BRIGHT DAYTIME SKY GRADIENT ──
  const skyGeo = new THREE.PlaneGeometry(4000, 4000);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      uZenith:  { value: new THREE.Color(0x1a8fd1) },
      uMid:     { value: new THREE.Color(0x5bbde8) },
      uHorizon: { value: new THREE.Color(0xc9eaf8) },
      uSun:     { value: new THREE.Color(0xfffbe0) },
      uTime:    { value: 0.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uZenith;
      uniform vec3 uMid;
      uniform vec3 uHorizon;
      uniform vec3 uSun;
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        vec3 col = mix(uHorizon, uMid,   smoothstep(0.0, 0.4,  vUv.y));
        col       = mix(col,     uZenith, smoothstep(0.3, 1.0,  vUv.y));

        // Sun disc + radial glow
        vec2 sunPos = vec2(0.75, 0.72);
        float d = distance(vUv, sunPos);
        col += uSun * exp(-d * 3.8) * 0.6;
        col += vec3(1.0, 1.0, 0.95) * exp(-d * 40.0) * 1.2;

        // Horizon haze
        float haze = pow(1.0 - vUv.y, 3.0) * 0.35;
        col = mix(col, vec3(0.88, 0.95, 1.0), haze);

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false
  });

  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  skyDome.position.z = -1200;
  scene.add(skyDome);

  // ── FLUFFY CLOUDS ──
  const clouds = [];

  function makeCloud(x, y, z, scale, speed) {
    const group = new THREE.Group();

    const puffs = [
      { px:  0,   py:  0,   pz:  0,   s: 1.00 },
      { px:  22,  py: -6,   pz:  3,   s: 0.80 },
      { px: -22,  py: -8,   pz: -2,   s: 0.75 },
      { px:  11,  py:  10,  pz:  4,   s: 0.70 },
      { px: -10,  py:  8,   pz: -3,   s: 0.65 },
      { px:  34,  py:  0,   pz:  2,   s: 0.60 },
      { px: -34,  py: -2,   pz:  1,   s: 0.58 },
      { px:  0,   py:  14,  pz:  0,   s: 0.55 },
      { px:  18,  py:  6,   pz: -4,   s: 0.52 },
      { px: -16,  py:  4,   pz:  5,   s: 0.50 },
      { px:  42,  py: -10,  pz:  0,   s: 0.45 },
      { px: -42,  py: -12,  pz:  2,   s: 0.42 },
    ];

    puffs.forEach(p => {
      const geo = new THREE.SphereGeometry(14 * p.s, 8, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(
          0.96 + Math.random() * 0.04,
          0.97 + Math.random() * 0.03,
          1.0
        ),
        roughness: 1.0,
        metalness: 0.0,
        transparent: true,
        opacity: 0.88 + Math.random() * 0.1,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.px * scale, p.py * scale, p.pz * scale * 0.3);
      mesh.scale.setScalar(scale);
      group.add(mesh);
    });

    // Shadow underside
    const shadowGeo = new THREE.SphereGeometry(20 * scale, 8, 4);
    const shadowMat = new THREE.MeshStandardMaterial({
      color: 0xb8d8ee,
      roughness: 1,
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.scale.set(1.6, 0.22, 0.8);
    shadow.position.y = -18 * scale;
    group.add(shadow);

    group.position.set(x, y, z);
    scene.add(group);
    clouds.push({ mesh: group, speed: speed || 0.08 + Math.random() * 0.05 });
    return group;
  }

  const cloudData = [
    // Far background
    [ -500,  80, -600,  2.2,  0.04 ],
    [  100, 100, -580,  2.5,  0.035],
    [  600,  60, -560,  2.0,  0.045],
    [ -200,  50, -550,  1.8,  0.038],
    [  350, 120, -600,  2.3,  0.032],
    [ -700,  70, -570,  2.1,  0.042],
    // Mid layer
    [ -350,  40, -300,  1.6,  0.07 ],
    [  200,  70, -280,  1.9,  0.065],
    [  550,  30, -310,  1.5,  0.08 ],
    [ -100,  90, -320,  1.7,  0.06 ],
    [  700,  55, -290,  1.4,  0.075],
    [ -600,  45, -300,  1.8,  0.058],
    [  400, 110, -270,  1.3,  0.085],
    // Foreground close clouds
    [ -250, -30, -120,  1.1,  0.12 ],
    [  450,  20, -100,  1.2,  0.10 ],
    [ -600,  10, -130,  1.0,  0.14 ],
    [  650, -10, -110,  0.95, 0.13 ],
    [  100,  50, -150,  1.3,  0.09 ],
    [ -400,  60, -140,  1.15, 0.11 ],
  ];

  cloudData.forEach(d => makeCloud(...d));

  // ── PROCEDURAL AIRCRAFT ──
  function buildAircraft(bodyColor, accentColor, scale) {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor || 0xffffff,
      metalness: 0.55,
      roughness: 0.25,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: accentColor || 0xf5a623,
      metalness: 0.7,
      roughness: 0.2,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x99ddff,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.75
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1a2a3a,
      metalness: 0.5,
      roughness: 0.4
    });

    // Fuselage via LatheGeometry
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      let r;
      if (t < 0.08) r = t / 0.08 * 3.0;
      else if (t < 0.75) r = 3.0;
      else r = 3.0 * (1.0 - (t - 0.75) / 0.25);
      points.push(new THREE.Vector2(r, (t - 0.5) * 42));
    }
    const fuseGeo = new THREE.LatheGeometry(points, 12);
    const fuse = new THREE.Mesh(fuseGeo, bodyMat);
    fuse.rotation.x = Math.PI / 2;
    group.add(fuse);

    // Nose cone
    const noseGeo = new THREE.ConeGeometry(3.0, 12, 12);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = 27;
    group.add(nose);

    // Cockpit
    const cockpitGeo = new THREE.SphereGeometry(1.8, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
    cockpit.position.set(0, 2.8, 22);
    group.add(cockpit);

    // Wings
    function makeWing(side) {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(-12, side * 36);
      shape.lineTo(-18, side * 36);
      shape.lineTo(-8, 0);
      shape.closePath();

      const ext = new THREE.ExtrudeGeometry(shape, {
        depth: 0.6, bevelEnabled: true,
        bevelThickness: 0.15, bevelSize: 0.1, bevelSegments: 1
      });
      const wing = new THREE.Mesh(ext, bodyMat);
      wing.rotation.x = Math.PI / 2;
      wing.position.set(-3, 0, 0);
      group.add(wing);

      // Winglet
      const wlGeo = new THREE.BoxGeometry(0.5, 5, 2);
      const wl = new THREE.Mesh(wlGeo, accentMat);
      wl.position.set(-17, side * 1.5, side * 36);
      wl.rotation.z = side * 0.35;
      group.add(wl);
    }
    makeWing(1); makeWing(-1);

    // Horizontal stabilisers
    function makeHStab(side) {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(-4, side * 14);
      shape.lineTo(-7, side * 14);
      shape.lineTo(-4, 0);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.4, bevelEnabled: false });
      const m = new THREE.Mesh(geo, bodyMat);
      m.rotation.x = Math.PI / 2;
      m.position.set(-4, 0, -18);
      group.add(m);
    }
    makeHStab(1); makeHStab(-1);

    // Vertical stabiliser
    const vShape = new THREE.Shape();
    vShape.moveTo(0, 0);
    vShape.lineTo(-8, 0);
    vShape.lineTo(-8, 10);
    vShape.lineTo(-2, 14);
    vShape.lineTo(0, 10);
    vShape.closePath();
    const vGeo = new THREE.ExtrudeGeometry(vShape, { depth: 0.4, bevelEnabled: false });
    const vStab = new THREE.Mesh(vGeo, bodyMat);
    vStab.rotation.y = Math.PI / 2;
    vStab.position.set(0, 0, -20);
    group.add(vStab);

    // Engines
    function makeEngine(side) {
      const nacGeo = new THREE.CylinderGeometry(2.4, 2.6, 10, 10);
      const nac = new THREE.Mesh(nacGeo, bodyMat);
      nac.rotation.x = Math.PI / 2;
      nac.position.set(-6, -4.5, side * 14);
      group.add(nac);

      const intakeGeo = new THREE.TorusGeometry(2.4, 0.3, 8, 16);
      const intake = new THREE.Mesh(intakeGeo, accentMat);
      intake.rotation.x = Math.PI / 2;
      intake.position.set(-6, -4.5, side * 14 + 5.2);
      group.add(intake);

      const innerGeo = new THREE.CircleGeometry(2.1, 10);
      const inner = new THREE.Mesh(innerGeo, darkMat);
      inner.rotation.x = -Math.PI / 2;
      inner.rotation.z = Math.PI / 2;
      inner.position.set(-6, -4.5, side * 14 + 5.5);
      group.add(inner);

      const pylGeo = new THREE.BoxGeometry(0.6, 3, 6);
      const pyl = new THREE.Mesh(pylGeo, bodyMat);
      pyl.position.set(-6, -2.5, side * 14);
      group.add(pyl);
    }
    makeEngine(1); makeEngine(-1);

    // Livery stripe
    const stripeGeo = new THREE.CylinderGeometry(3.05, 3.05, 26, 12, 1, true);
    const stripeMat = new THREE.MeshBasicMaterial({
      color: accentColor || 0xf5a623,
      transparent: true, opacity: 0.28,
      side: THREE.FrontSide
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.rotation.x = Math.PI / 2;
    group.add(stripe);

    // Windows
    for (let i = 0; i < 10; i++) {
      const wGeo = new THREE.SphereGeometry(0.5, 6, 5);
      const wm = new THREE.Mesh(wGeo, glassMat);
      wm.position.set(0, 3.05, 14 - i * 3.2);
      group.add(wm);
      const wm2 = wm.clone();
      wm2.position.set(0, -3.05, 14 - i * 3.2);
      group.add(wm2);
    }

    group.scale.setScalar(scale || 1);
    return group;
  }

  // ── FLEET ──
  const fleetConfigs = [
    { x: -700, y:  55, z:  -20, scale: 1.4, speed: 0.55, dir:  1, ry: 0,       rz: -0.04, color: 0xffffff, accent: 0xf5a623 },
    { x:  700, y:  20, z:  -30, scale: 1.2, speed: 0.45, dir: -1, ry: Math.PI, rz:  0.04, color: 0xf0f8ff, accent: 0x2979ff },
    { x: -600, y: -30, z:  -50, scale: 1.0, speed: 0.60, dir:  1, ry: 0.05,    rz: -0.03, color: 0xfff8f0, accent: 0xff5722 },
    { x:  500, y:  80, z: -100, scale: 0.85,speed: 0.38, dir: -1, ry: Math.PI, rz:  0.05, color: 0xffffff, accent: 0x00c853 },
    { x: -400, y: 110, z: -120, scale: 0.90,speed: 0.42, dir:  1, ry: 0.08,    rz: -0.05, color: 0xf5f5f5, accent: 0xf5a623 },
    { x:  300, y: -10, z:  -80, scale: 0.80,speed: 0.50, dir: -1, ry: Math.PI, rz:  0.03, color: 0xe8f4fd, accent: 0xe91e63 },
    { x: -500, y:  40, z: -200, scale: 0.55,speed: 0.25, dir:  1, ry: 0,       rz: -0.02, color: 0xffffff, accent: 0xf5a623 },
    { x:  600, y:  60, z: -220, scale: 0.50,speed: 0.22, dir: -1, ry: Math.PI, rz:  0.02, color: 0xf0f8ff, accent: 0x2979ff },
    { x: -200, y:  90, z: -250, scale: 0.45,speed: 0.18, dir:  1, ry: 0.04,    rz: -0.02, color: 0xffffff, accent: 0xff5722 },
  ];

  const fleet = [];
  fleetConfigs.forEach((cfg, i) => {
    const ac = buildAircraft(cfg.color, cfg.accent, cfg.scale);
    ac.position.set(cfg.x, cfg.y, cfg.z);
    ac.rotation.y = cfg.ry;
    ac.rotation.z = cfg.rz;
    scene.add(ac);
    fleet.push({ mesh: ac, speed: cfg.speed, dir: cfg.dir, baseY: cfg.y, phase: (i / fleetConfigs.length) * Math.PI * 2, range: 900 });
  });

  // ── LIGHTING ──
  scene.add(new THREE.AmbientLight(0xd0eeff, 1.4));

  const sun = new THREE.DirectionalLight(0xfffbe8, 3.5);
  sun.position.set(300, 400, 200);
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x9ec8e8, 0.8);
  fill.position.set(-200, -100, 100);
  scene.add(fill);

  scene.add(new THREE.HemisphereLight(0x87ceeb, 0xc8e6c9, 0.6));

  // ── PARALLAX STATE ──
  let mouseX = 0, mouseY = 0, smoothX = 0, smoothY = 0, scrollY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / W() - 0.5) * 2;
    mouseY = (e.clientY / H() - 0.5) * 2;
  });

  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  });

  // ── ANIMATION LOOP ──
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.007;

    smoothX += (mouseX - smoothX) * 0.035;
    smoothY += (mouseY - smoothY) * 0.035;
    camera.position.x = smoothX * 18;
    camera.position.y = smoothY * 10 - scrollY * 0.005;
    camera.lookAt(0, 0, -80);

    fleet.forEach(p => {
      p.mesh.position.x += p.speed * p.dir;
      if (p.dir > 0 && p.mesh.position.x >  p.range) p.mesh.position.x = -p.range;
      if (p.dir < 0 && p.mesh.position.x < -p.range) p.mesh.position.x =  p.range;

      const bob = Math.sin(time * 0.45 + p.phase) * 4;
      p.mesh.position.y = p.baseY + bob;
      p.mesh.rotation.z = (p.dir > 0 ? -1 : 1) * (0.04 + Math.sin(time * 0.45 + p.phase) * 0.012);
      p.mesh.rotation.x = -0.03;
    });

    clouds.forEach(c => {
      c.mesh.position.x += c.speed;
      if (c.mesh.position.x > 900) c.mesh.position.x = -900;
    });

    skyMat.uniforms.uTime.value = time;
    renderer.render(scene, camera);
  }
  animate();
})();


// ── NAVBAR ────────────────────────────────────────────────────
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const toggle     = document.getElementById('nav-toggle');
  const links      = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActiveSection();
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  const sections = document.querySelectorAll('section[id]');
  function highlightActiveSection() {
    const pos = window.scrollY + window.innerHeight * 0.35;
    let cur = '';
    sections.forEach(s => { if (pos >= s.offsetTop) cur = s.id; });
    navAnchors.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === `#${cur}`); });
  }
  highlightActiveSection();
})();


// ── SMOOTH SCROLL ─────────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });
})();


// ── SCROLL REVEAL ─────────────────────────────────────────────
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.glass-panel, .section-title, .section-label, .timeline-item, .edu-card, .project-card, .seminar-item'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => obs.observe(el));
})();


// ── ALTIMETER ─────────────────────────────────────────────────
(function initAltimeter() {
  const el = document.querySelector('.alt-value');
  if (!el) return;
  let n = 0;
  function tick() { if (n < 390) { n = Math.min(n + 8, 390); el.textContent = `FL${n}`; requestAnimationFrame(tick); } }
  setTimeout(tick, 1200);
})();


// ── CURSOR GLOW ───────────────────────────────────────────────
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot = document.createElement('div');
  dot.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:8px;height:8px;border-radius:50%;background:rgba(245,166,35,0.9);transform:translate(-50%,-50%);mix-blend-mode:multiply;';
  const ring = document.createElement('div');
  ring.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(245,166,35,0.5);transform:translate(-50%,-50%);';
  document.body.appendChild(dot); document.body.appendChild(ring);
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  (function animRing(){ rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing); })();
})();
