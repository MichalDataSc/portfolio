/* Hero chart — "turning data into decisions & profit".
   One looping story: data → model → decision → profit, each step highlighted in turn.
   Drawn at 460x290 (the homepage panel's coordinate system). */
const HERO = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const eln = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const svg = host => { const s = eln('svg', { viewBox: '0 0 460 290', width: '100%' }); host.appendChild(s); return s; };
  let UID = 0;

  function combined(host) {
    const s = svg(host); const uid = ++UID;
    const defs = eln('defs', {}); s.appendChild(defs);

    /* ---- flow header: data → model → decision → profit ---- */
    const steps = ['data', 'model', 'decision', 'profit'];
    const hx = [70, 160, 250, 340], hy = 28;
    s.appendChild(eln('line', { x1: hx[0], y1: hy, x2: hx[3], y2: hy, stroke: 'rgba(159,176,207,.2)', 'stroke-width': 1.5 }));
    const stepEls = steps.map((lab, i) => {
      const dot = eln('circle', { cx: hx[i], cy: hy, r: 5, fill: 'rgba(159,176,207,.3)' }); s.appendChild(dot);
      const t = eln('text', { x: hx[i], y: hy - 12, 'text-anchor': 'middle', fill: 'rgba(159,176,207,.45)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 10 }); t.textContent = lab; s.appendChild(t);
      if (i < 3) { const ar = eln('text', { x: (hx[i] + hx[i + 1]) / 2, y: hy + 4, 'text-anchor': 'middle', fill: 'rgba(159,176,207,.35)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 11 }); ar.textContent = '→'; s.appendChild(ar); }
      return { dot, t };
    });
    function setActive(idx) {
      stepEls.forEach((e, i) => { const done = i < idx, act = i === idx;
        e.dot.setAttribute('fill', act ? '#9fe3ff' : (done ? 'rgba(56,189,248,.7)' : 'rgba(159,176,207,.3)'));
        e.dot.setAttribute('r', act ? 6.5 : 5);
        e.t.setAttribute('fill', act ? '#9fe3ff' : (done ? 'rgba(56,189,248,.7)' : 'rgba(159,176,207,.45)')); });
    }

    /* ---- plot region ---- */
    const X0 = 52, X1 = 430, Y0 = 258, Y1 = 66;
    s.appendChild(eln('rect', { x: X0 - 8, y: Y1 - 6, width: X1 - X0 + 16, height: Y0 - Y1 + 14, rx: 10, fill: 'none', stroke: 'rgba(159,176,207,.1)' }));
    const cp = eln('clipPath', { id: 'clip' + uid }); cp.appendChild(eln('rect', { x: X0 - 8, y: Y1 - 6, width: X1 - X0 + 16, height: Y0 - Y1 + 14 })); defs.appendChild(cp);
    const boundary = eln('line', { stroke: '#c7d2fe', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0, 'clip-path': 'url(#clip' + uid + ')' }); s.appendChild(boundary);
    const pg = eln('g', {}); s.appendChild(pg);
    // profit readout — sits inline in the header, right after the "profit" step
    const counter = eln('text', { x: 358, y: 32, fill: '#9fe3ff', 'font-family': 'Space Grotesk, sans-serif', 'font-size': 15, 'font-weight': 700, opacity: 0 }); s.appendChild(counter);

    let pts = [], theta = 0, target = 0, cx0 = 0, cy0 = 0, mA = { x: 0, y: 0 }, total = 0, k = 0;
    function gen() {
      while (pg.firstChild) pg.removeChild(pg.firstChild); pts = []; total = 0;
      mA = { x: X0 + (X1 - X0) * (0.58 + Math.random() * 0.12), y: Y1 + (Y0 - Y1) * (0.22 + Math.random() * 0.16) };
      const mB = { x: X0 + (X1 - X0) * (0.3 + Math.random() * 0.12), y: Y1 + (Y0 - Y1) * (0.6 + Math.random() * 0.16) };
      const blob = (m, cls, n) => { for (let i = 0; i < n; i++) {
        const x = Math.max(X0 + 6, Math.min(X1 - 6, m.x + (Math.random() + Math.random() - 1) * 72));
        const y = Math.max(Y1 + 6, Math.min(Y0 - 6, m.y + (Math.random() + Math.random() - 1) * 52));
        const c = eln('circle', { cx: x, cy: y, r: 0, fill: 'rgba(159,176,207,.45)' }); pg.appendChild(c);
        pts.push({ x, y, cls, c, val: 60 + Math.random() * 340, ring: null }); } };
      blob(mA, 1, 16); blob(mB, 0, 16);
      cx0 = (mA.x + mB.x) / 2; cy0 = (mA.y + mB.y) / 2;
      target = Math.atan2(mA.y - mB.y, mA.x - mB.x) + Math.PI / 2;
      theta = target + 1.2 * (Math.random() < 0.5 ? 1 : -1);
    }
    gen();
    const T_DATA = 80, T_MODEL = 195, T_DEC = 300, T_END = 450;
    (function f() {
      k++;
      const phase = k < T_DATA ? 0 : k < T_MODEL ? 1 : k < T_DEC ? 2 : 3;
      setActive(phase);
      pts.forEach((p, i) => { const a = Math.max(0, Math.min(1, (k - i * 1.5) / 26)); if (phase === 0 || k < T_DATA + 40) p.c.setAttribute('r', a * 4.4); });
      const nx = -Math.sin(theta), ny = Math.cos(theta);
      const aSide = ((mA.x - cx0) * nx + (mA.y - cy0) * ny) > 0 ? 1 : 0;
      if (phase >= 1) {
        theta += (target - theta) * 0.06;
        const dx = Math.cos(theta) * 480, dy = Math.sin(theta) * 480;
        boundary.setAttribute('x1', cx0 - dx); boundary.setAttribute('y1', cy0 - dy); boundary.setAttribute('x2', cx0 + dx); boundary.setAttribute('y2', cy0 + dy);
        boundary.setAttribute('opacity', Math.min(0.9, (k - T_DATA) / 30));
      } else boundary.setAttribute('opacity', 0);
      pts.forEach(p => {
        const side = ((p.x - cx0) * nx + (p.y - cy0) * ny) > 0 ? 1 : 0; const good = side === aSide;
        if (phase === 0) p.c.setAttribute('fill', 'rgba(159,176,207,.45)');
        else if (phase === 1) p.c.setAttribute('fill', good ? 'rgba(56,189,248,.6)' : 'rgba(159,176,207,.4)');
        else {
          if (good) { p.c.setAttribute('fill', 'rgba(56,189,248,.95)');
            if (!p.ring) { p.ring = eln('circle', { cx: p.x, cy: p.y, r: 7, fill: 'none', stroke: '#9fe3ff', 'stroke-width': 1.2, opacity: 0 }); pg.appendChild(p.ring); } }
          else p.c.setAttribute('fill', phase === 3 ? 'rgba(159,176,207,.16)' : 'rgba(159,176,207,.3)');
        }
      });
      if (phase === 2) { const pr = (k - T_MODEL) / (T_DEC - T_MODEL);
        pts.forEach(p => { if (p.ring) { p.ring.setAttribute('opacity', Math.min(1, pr * 1.6)); p.ring.setAttribute('r', 7 + Math.sin(k * 0.2) * 1.3); } }); }
      if (phase === 3) {
        if (total === 0) total = pts.filter(p => (((p.x - cx0) * nx + (p.y - cy0) * ny) > 0 ? 1 : 0) === aSide).reduce((a, p) => a + p.val, 0);
        const pr = Math.min(1, (k - T_DEC) / 70);
        counter.setAttribute('opacity', 1);
        counter.textContent = '$' + Math.round(total * pr).toLocaleString();
      } else { counter.setAttribute('opacity', 0); }
      if (k >= T_END) { k = 0; gen(); }
      requestAnimationFrame(f);
    })();
  }

  function panel(cap) {
    const w = document.createElement('div'); w.className = 'chartpanel';
    w.innerHTML = `<div class="cap"><b>${cap}</b><span class="live"><span class="dot"></span>live</span></div><div class="cv"></div>`;
    combined(w.querySelector('.cv'));
    return w;
  }
  return { panel };
})();
