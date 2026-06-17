/* Animated, looping mini-charts — one per portfolio project.
   PC.PROJECTS = the project data; PC.panel(type,caption) builds a captioned chart panel. */
const PC = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const VW = 340, VH = 190;
  const eln = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const dstr = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  function svg(host) {
    const s = eln('svg', { viewBox: `0 0 ${VW} ${VH}`, width: '100%' });
    host.appendChild(s); return s;
  }

  /* 1. STRATEGY — initiative prioritization, bubbles easing into an impact/effort matrix */
  function strategy(host) {
    const s = svg(host);
    s.appendChild(eln('line', { x1: 170, y1: 14, x2: 170, y2: 176, stroke: 'rgba(159,176,207,.18)', 'stroke-width': 1 }));
    s.appendChild(eln('line', { x1: 22, y1: 95, x2: 318, y2: 95, stroke: 'rgba(159,176,207,.18)', 'stroke-width': 1 }));
    const lbl = (x, y, t) => { const e = eln('text', { x, y, fill: 'rgba(159,176,207,.5)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 8 }); e.textContent = t; s.appendChild(e); };
    lbl(300, 92, 'impact →'); lbl(176, 24, '↑ value');
    const N = 6, bs = [];
    for (let i = 0; i < N; i++) { const c = eln('circle', { cx: 170, cy: 95, r: 6, fill: 'rgba(159,176,207,.35)' }); s.appendChild(c); bs.push({ c, x: 170, y: 95, tx: 170, ty: 95, r: 7 + Math.random() * 9, win: false }); }
    function retarget() { bs.forEach(b => { b.tx = 40 + Math.random() * 256; b.ty = 28 + Math.random() * 138; b.win = false; }); const w = bs[0]; w.tx = 236 + Math.random() * 54; w.ty = 30 + Math.random() * 34; w.win = true; }
    retarget(); let k = 0;
    (function f() {
      if (++k % 280 === 0) retarget();
      bs.forEach(b => {
        b.x += (b.tx - b.x) * .06; b.y += (b.ty - b.y) * .06;
        b.c.setAttribute('cx', b.x); b.c.setAttribute('cy', b.y); b.c.setAttribute('r', b.r);
        b.c.setAttribute('fill', b.win ? 'rgba(56,189,248,.85)' : 'rgba(159,176,207,.33)');
        if (b.win) { b.c.setAttribute('stroke', '#9fe3ff'); b.c.setAttribute('stroke-width', 1.4); }
      });
      requestAnimationFrame(f);
    })();
  }

  /* 2. BREWERY — process efficiency climbing toward a target with diminishing returns */
  function brewery(host) {
    const s = svg(host);
    const X0 = 30, X1 = 316, Y0 = 168, Y1 = 26;
    const yOf = e => Y0 - (e - 0.6) / (0.99 - 0.6) * (Y0 - Y1);
    s.appendChild(eln('line', { x1: X0, y1: yOf(0.95), x2: X1, y2: yOf(0.95), stroke: 'rgba(199,210,254,.4)', 'stroke-width': 1, 'stroke-dasharray': '4 4' }));
    const path = eln('path', { fill: 'none', stroke: '#38bdf8', 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }); s.appendChild(path);
    const dot = eln('circle', { r: 4, fill: '#9fe3ff' }); s.appendChild(dot);
    const txt = eln('text', { x: X1, y: Y1 - 6, 'text-anchor': 'end', fill: '#9fe3ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 13 }); s.appendChild(txt);
    const n = 60, pts = [];
    for (let i = 0; i <= n; i++) { const u = i / n; const eff = 0.95 - 0.23 * Math.exp(-3.2 * u); pts.push([X0 + u * (X1 - X0), yOf(eff), eff]); }
    let k = 0;
    (function f() {
      k += 0.7; const kk = Math.min(k | 0, n);
      path.setAttribute('d', dstr(pts.slice(0, kk + 1)));
      const p = pts[kk]; dot.setAttribute('cx', p[0]); dot.setAttribute('cy', p[1]); txt.textContent = (p[2] * 100).toFixed(1) + '%';
      if (kk >= n) k = -40;
      requestAnimationFrame(f);
    })();
  }

  /* 3. RTB — live bid stream scrolling left; bars over the threshold = wins */
  function rtb(host) {
    const s = svg(host);
    const X0 = 18, X1 = 322, Y0 = 168, thr = 88;
    s.appendChild(eln('line', { x1: X0, y1: thr, x2: X1, y2: thr, stroke: 'rgba(199,210,254,.45)', 'stroke-width': 1, 'stroke-dasharray': '4 4' }));
    const txt = eln('text', { x: X1, y: 22, 'text-anchor': 'end', fill: '#9fe3ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 12 }); s.appendChild(txt);
    let bars = [], k = 0, wins = 0, tot = 0;
    (function f() {
      k++;
      bars.forEach(b => { b.x -= 1.7; b.r.setAttribute('x', b.x); });
      bars = bars.filter(b => { if (b.x < X0 - 8) { b.r.remove(); return false; } return true; });
      if (k % 9 === 0) {
        const h = 18 + Math.random() * 122, y = Y0 - h, win = y < thr;
        const r = eln('rect', { x: X1, y, width: 5, height: h, rx: 1.5, fill: win ? 'rgba(56,189,248,.9)' : 'rgba(159,176,207,.3)' });
        s.appendChild(r); bars.push({ x: X1, r }); tot++; if (win) wins++;
        if (tot > 400) { tot = Math.round(tot / 2); wins = Math.round(wins / 2); }
      }
      txt.textContent = 'win ' + (tot ? Math.round(wins / tot * 100) : 0) + '%';
      requestAnimationFrame(f);
    })();
  }

  /* 4. CAUSAL — diff-in-diff: treated line lifts above the counterfactual after the intervention */
  function causal(host) {
    const s = svg(host);
    const X0 = 24, X1 = 316, Y0 = 168, Y1 = 26, XM = 170;
    s.appendChild(eln('line', { x1: XM, y1: Y1, x2: XM, y2: Y0, stroke: 'rgba(199,210,254,.4)', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
    const band = eln('polygon', { fill: '#38bdf8', opacity: 0 }); s.appendChild(band);
    const cf = eln('path', { fill: 'none', stroke: 'rgba(199,210,254,.55)', 'stroke-width': 1.8, 'stroke-dasharray': '5 5' }); s.appendChild(cf);
    const ctrl = eln('path', { fill: 'none', stroke: 'rgba(159,176,207,.6)', 'stroke-width': 2 }); s.appendChild(ctrl);
    const treat = eln('path', { fill: 'none', stroke: '#38bdf8', 'stroke-width': 2.8, 'stroke-linecap': 'round' }); s.appendChild(treat);
    const n = 60, cP = [], tP = [], fP = [];
    for (let i = 0; i <= n; i++) { const u = i / n, x = X0 + u * (X1 - X0), bt = Y0 - 26 - u * 60 + Math.sin(u * 9) * 4; cP.push([x, bt]); fP.push([x, bt]); const lift = x > XM ? (x - XM) / (X1 - XM) * 44 : 0; tP.push([x, bt - lift]); }
    const mi = Math.round(n * (XM - X0) / (X1 - X0));
    let k = 0;
    (function f() {
      k += 0.8; const kk = Math.min(k | 0, n);
      ctrl.setAttribute('d', dstr(cP.slice(0, kk + 1)));
      treat.setAttribute('d', dstr(tP.slice(0, kk + 1)));
      if (kk > mi) {
        cf.setAttribute('d', dstr(fP.slice(mi, kk + 1)));
        band.setAttribute('points', tP.slice(mi, kk + 1).concat(fP.slice(mi, kk + 1).reverse()).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '));
        band.setAttribute('opacity', .16);
      }
      if (kk >= n) { k = -50; band.setAttribute('opacity', 0); cf.setAttribute('d', ''); }
      requestAnimationFrame(f);
    })();
  }

  /* 5. FORECAST — seasonal demand history + dashed forecast + widening band */
  function forecast(host) {
    const s = svg(host);
    const X0 = 24, X1 = 316, Y0 = 168, Y1 = 26, XM = 198, mid = (Y0 + Y1) / 2, amp = 40;
    const fan = eln('polygon', { fill: '#38bdf8', opacity: 0 }); s.appendChild(fan);
    s.appendChild(eln('line', { x1: XM, y1: Y1, x2: XM, y2: Y0, stroke: 'rgba(199,210,254,.35)', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
    const hist = eln('path', { fill: 'none', stroke: '#38bdf8', 'stroke-width': 2.6, 'stroke-linecap': 'round' }); s.appendChild(hist);
    const fc = eln('path', { fill: 'none', stroke: '#c7d2fe', 'stroke-width': 2.2, 'stroke-dasharray': '6 6' }); s.appendChild(fc);
    const nH = 42, nF = 26, hP = [], fP = [], up = [], lo = [];
    const yv = v => mid - v;
    for (let i = 0; i <= nH; i++) { const u = i / nH, x = X0 + u * (XM - X0), v = amp * Math.sin(u * 7) + (Math.random() - .5) * 7; hP.push([x, yv(v)]); }
    const last = hP[nH]; fP.push(last.slice()); up.push(last.slice()); lo.push(last.slice());
    for (let i = 1; i <= nF; i++) { const u = i / nF, x = XM + u * (X1 - XM), v = amp * Math.sin(7 + u * 4.2), y = yv(v), sp = 4 + 30 * Math.sqrt(u); fP.push([x, y]); up.push([x, y - sp]); lo.push([x, y + sp]); }
    let k = 0; const tot = nH + nF + 14;
    (function f() {
      k += 0.85; const kk = k | 0, hh = Math.min(kk, nH);
      hist.setAttribute('d', dstr(hP.slice(0, hh + 1)));
      if (kk > nH) { const ff = Math.min(kk - nH, nF); fc.setAttribute('d', dstr(fP.slice(0, ff + 1))); fan.setAttribute('points', up.slice(0, ff + 1).concat(lo.slice(0, ff + 1).reverse()).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')); fan.setAttribute('opacity', .16); }
      if (kk >= tot) { k = 0; fan.setAttribute('opacity', 0); fc.setAttribute('d', ''); }
      requestAnimationFrame(f);
    })();
  }

  const MAP = { strategy, brewery, rtb, causal, forecast };
  function mount(host, type) { (MAP[type] || forecast)(host); }
  function panel(type, cap) {
    const w = document.createElement('div'); w.className = 'chartpanel';
    w.innerHTML = `<div class="cap"><b>${cap}</b><span class="live"><span class="dot"></span>live</span></div><div class="cv"></div>`;
    mount(w.querySelector('.cv'), type);
    return w;
  }

  const PROJECTS = [
    { tag: 'Financial services · Strategy (BCG)', title: 'Strategy for a leading bank &amp; a European insurer', type: 'strategy', cap: 'initiative prioritization', blurb: 'Hands-on with client data, research and interviews — building the analyses and presentations behind strategic recommendations delivered to senior stakeholders.' },
    { tag: 'Manufacturing · Advanced analytics (BCG)', title: "Efficiency optimization for one of the world's largest brewers", type: 'brewery', cap: 'process efficiency', blurb: 'Brought ML and advanced analytics into an operational optimization engagement — turning messy production data into measurable efficiency gains. Yes, I once optimized a brewery.' },
    { tag: 'AdTech · ML &amp; experimentation', title: 'Real-time bidding systems for leading AdTech', type: 'rtb', cap: 'live bid stream', blurb: 'ML models that buy mobile display inventory in real time, paired with disciplined A/B testing and reinforcement learning — solutions that move profit, measurably.' },
    { tag: 'Retail · Causal inference', title: 'Marketing measurement &amp; optimization for a top global retailer', type: 'causal', cap: 'incremental lift · diff-in-diff', blurb: 'A framework to measure campaign effectiveness and optimize spend across channels — grounded in causal inference and proper experimentation, not last-click guesswork.' },
    { tag: 'FMCG / Product · Analytics', title: 'Forecasting, audits &amp; decision support', type: 'forecast', cap: 'demand forecast', blurb: 'Demand forecasting, data audits, A/B-test design and data-driven recommendations to product and C-level stakeholders — plus training teams in applied AI.' },
  ];

  return { mount, panel, PROJECTS };
})();
