/* Chart-lab: 2 propositions each for Process optimization, Bid auction, and Marketing measurement. */
const LAB = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const eln = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const svg = host => { const s = eln('svg', { viewBox: '0 0 340 190', width: '100%' }); host.appendChild(s); return s; };

  /* ============ PROCESS OPTIMIZATION ============ */

  // A — parallel conveyor lanes; flow speeds up as throughput is optimized
  function prodA(host) {
    const s = svg(host); const X0 = 20, X1 = 320, lanes = [58, 95, 132];
    lanes.forEach(y => s.appendChild(eln('line', { x1: X0, y1: y, x2: X1, y2: y, stroke: 'rgba(159,176,207,.16)', 'stroke-width': 6, 'stroke-linecap': 'round' })));
    lanes.forEach(y => [0.28, 0.55, 0.82].forEach(fx => s.appendChild(eln('circle', { cx: X0 + fx * (X1 - X0), cy: y, r: 4, fill: 'rgba(159,176,207,.4)' }))));
    const txt = eln('text', { x: X1, y: 20, 'text-anchor': 'end', fill: '#9fe3ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 12 }); s.appendChild(txt);
    const lab = eln('text', { x: X0, y: 20, fill: 'rgba(159,176,207,.6)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9 }); lab.textContent = 'throughput'; s.appendChild(lab);
    let items = [], k = 0;
    const eff = () => 0.45 + 0.5 * (0.5 - 0.5 * Math.cos(k / 240 * Math.PI * 2));
    (function f() {
      k++; const e = eff(), speed = 0.6 + e * 2.4;
      if (k % Math.max(5, Math.round(20 - e * 12)) === 0) {
        const y = lanes[(Math.random() * 3) | 0];
        const r = eln('rect', { x: X0 - 6, y: y - 5, width: 11, height: 10, rx: 3, fill: 'rgba(56,189,248,.9)' }); s.appendChild(r); items.push({ x: X0 - 6, r });
      }
      for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; it.x += speed; it.r.setAttribute('x', it.x); if (it.x > X1 + 6) { it.r.remove(); items.splice(i, 1); } }
      txt.textContent = Math.round(40 + e * 70) + '/min';
      requestAnimationFrame(f);
    })();
  }

  // B — single line with stations; a bottleneck (ferment) clogs, then is optimized and clears
  function prodB(host) {
    const s = svg(host); const X0 = 22, X1 = 318, Y = 92;
    s.appendChild(eln('line', { x1: X0, y1: Y, x2: X1, y2: Y, stroke: 'rgba(159,176,207,.16)', 'stroke-width': 8, 'stroke-linecap': 'round' }));
    const stations = [0.16, 0.42, 0.68, 0.92], names = ['mash', 'boil', 'ferment', 'fill'], nodes = [];
    stations.forEach((fx, i) => { const cx = X0 + fx * (X1 - X0);
      const c = eln('circle', { cx, cy: Y, r: 7, fill: 'rgba(159,176,207,.5)' }); s.appendChild(c); nodes.push({ cx, c });
      const t = eln('text', { x: cx, y: Y + 24, 'text-anchor': 'middle', fill: 'rgba(159,176,207,.55)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 8 }); t.textContent = names[i]; s.appendChild(t); });
    const bnX = X0 + stations[2] * (X1 - X0);
    const txt = eln('text', { x: X1, y: 22, 'text-anchor': 'end', fill: '#9fe3ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 12 }); s.appendChild(txt);
    let items = [], k = 0;
    const optimized = () => (Math.floor(k / 380) % 2) === 1;
    (function f() {
      k++; const opt = optimized();
      nodes[2].c.setAttribute('fill', opt ? 'rgba(56,189,248,.9)' : 'rgba(244,114,114,.75)');
      nodes[2].c.setAttribute('r', opt ? 8 : 7);
      if (k % 13 === 0) { const r = eln('rect', { x: X0 - 6, y: Y - 5, width: 11, height: 10, rx: 3, fill: 'rgba(56,189,248,.9)' }); s.appendChild(r); items.push({ x: X0 - 6, r }); }
      items.forEach(it => { let sp = 2.0; if (!opt && it.x > bnX - 28 && it.x < bnX) sp = 0.25; it.x += sp; it.r.setAttribute('x', it.x); });
      for (let i = items.length - 1; i >= 0; i--) if (items[i].x > X1 + 6) { items[i].r.remove(); items.splice(i, 1); }
      txt.textContent = (opt ? '94' : '61') + '/min' + (opt ? ' ✓' : '');
      requestAnimationFrame(f);
    })();
  }

  /* ============ BID AUCTION ============ */

  // A — bidder cards: numbers roll, then the winner is highlighted
  function auctionA(host) {
    const s = svg(host); const n = 5, W = 50, gap = 9, tot = n * W + (n - 1) * gap, sx = (340 - tot) / 2;
    const status = eln('text', { x: 170, y: 36, 'text-anchor': 'middle', fill: '#9fe3ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 11 }); s.appendChild(status);
    const cards = [];
    for (let i = 0; i < n; i++) { const x = sx + i * (W + gap);
      const rect = eln('rect', { x, y: 62, width: W, height: 58, rx: 8, fill: 'rgba(12,19,38,.7)', stroke: 'rgba(159,176,207,.25)', 'stroke-width': 1 }); s.appendChild(rect);
      const val = eln('text', { x: x + W / 2, y: 96, 'text-anchor': 'middle', fill: '#eaf1ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 14 }); s.appendChild(val);
      const lb = eln('text', { x: x + W / 2, y: 138, 'text-anchor': 'middle', fill: 'rgba(159,176,207,.55)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 8 }); lb.textContent = 'bid ' + (i + 1); s.appendChild(lb);
      cards.push({ rect, val }); }
    let phase = 'roll', timer = 0, bids = [], win = -1;
    function round() { bids = cards.map(() => 0.5 + Math.random() * 9.5); win = bids.indexOf(Math.max(...bids)); phase = 'roll'; timer = 0; }
    round();
    (function f() { timer++;
      if (phase === 'roll') { status.textContent = 'bidding…';
        cards.forEach(c => { c.val.textContent = '$' + (0.5 + Math.random() * 9.5).toFixed(2); c.rect.setAttribute('stroke', 'rgba(159,176,207,.25)'); c.rect.setAttribute('fill', 'rgba(12,19,38,.7)'); c.val.setAttribute('fill', '#eaf1ff'); });
        if (timer > 46) { phase = 'reveal'; timer = 0; } }
      else { status.textContent = '★ winner: bid ' + (win + 1) + '  ($' + bids[win].toFixed(2) + ')';
        cards.forEach((c, i) => { const w = i === win; c.val.textContent = '$' + bids[i].toFixed(2);
          c.rect.setAttribute('stroke', w ? '#38bdf8' : 'rgba(159,176,207,.12)'); c.rect.setAttribute('fill', w ? 'rgba(56,189,248,.18)' : 'rgba(12,19,38,.5)'); c.val.setAttribute('fill', w ? '#9fe3ff' : 'rgba(159,176,207,.4)'); });
        if (timer > 92) round(); }
      requestAnimationFrame(f);
    })();
  }

  // B — bid bars race to their values; tallest wins, dashed line = second price (RTB)
  function auctionB(host) {
    const s = svg(host); const n = 5, X0 = 30, X1 = 316, Y0 = 150, Yt = 32, bw = 24, slot = (X1 - X0) / n, maxV = 10;
    const status = eln('text', { x: 170, y: 20, 'text-anchor': 'middle', fill: '#9fe3ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 11 }); s.appendChild(status);
    const yOf = v => Y0 - (v / maxV) * (Y0 - Yt);
    const sp = eln('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: 'rgba(199,210,254,.55)', 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: 0 }); s.appendChild(sp);
    const bars = [];
    for (let i = 0; i < n; i++) { const cx = X0 + slot * (i + 0.5);
      const r = eln('rect', { x: cx - bw / 2, y: Y0, width: bw, height: 0, rx: 3, fill: 'rgba(159,176,207,.4)' }); s.appendChild(r);
      const v = eln('text', { x: cx, y: Y0 - 4, 'text-anchor': 'middle', fill: 'rgba(159,176,207,.7)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 10 }); s.appendChild(v);
      bars.push({ r, v, cx }); }
    let bids = [], cur = [], phase = 'grow', timer = 0, win = -1, second = 0;
    function round() { bids = bars.map(() => 1 + Math.random() * 9); cur = bars.map(() => 0); const srt = [...bids].sort((a, b) => b - a); win = bids.indexOf(srt[0]); second = srt[1]; phase = 'grow'; timer = 0; sp.setAttribute('opacity', 0); }
    round();
    (function f() { timer++;
      if (phase === 'grow') { let done = true; status.textContent = 'bids arriving…';
        bars.forEach((b, i) => { cur[i] += (bids[i] - cur[i]) * 0.12; if (Math.abs(bids[i] - cur[i]) > 0.05) done = false; const y = yOf(cur[i]); b.r.setAttribute('y', y); b.r.setAttribute('height', Y0 - y); b.v.setAttribute('y', y - 4); b.v.textContent = '$' + cur[i].toFixed(1); });
        if (done && timer > 26) { phase = 'reveal'; timer = 0; } }
      else { bars.forEach((b, i) => { const w = i === win; b.r.setAttribute('fill', w ? 'rgba(56,189,248,.9)' : 'rgba(159,176,207,.3)'); b.v.setAttribute('fill', w ? '#9fe3ff' : 'rgba(159,176,207,.5)'); });
        sp.setAttribute('y1', yOf(second)); sp.setAttribute('y2', yOf(second)); sp.setAttribute('opacity', 1);
        status.textContent = 'won @ $' + second.toFixed(1) + ' · 2nd-price';
        if (timer > 110) round(); }
      requestAnimationFrame(f);
    })();
  }

  /* ============ MARKETING MEASUREMENT (replaces diff-in-diff) ============ */

  // A — channel spend optimization: allocation shifts from even split to ROI-weighted, total ROI rises
  function mktgA(host) {
    const s = svg(host); const ch = ['Search', 'Social', 'Display', 'Video', 'Email'], roi = [2.1, 1.6, 1.1, 2.6, 1.3];
    const n = ch.length, X0 = 26, X1 = 316, Y0 = 150, Yt = 38, slot = (X1 - X0) / n, bw = 30, maxA = 0.4, yOf = a => Y0 - (a / maxA) * (Y0 - Yt);
    const txt = eln('text', { x: X1, y: 24, 'text-anchor': 'end', fill: '#9fe3ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 12 }); s.appendChild(txt);
    const status = eln('text', { x: X0, y: 24, fill: 'rgba(159,176,207,.7)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9 }); s.appendChild(status);
    const bars = [];
    for (let i = 0; i < n; i++) { const cx = X0 + slot * (i + 0.5);
      const r = eln('rect', { x: cx - bw / 2, y: Y0, width: bw, height: 0, rx: 3, fill: 'rgba(159,176,207,.4)' }); s.appendChild(r);
      const l = eln('text', { x: cx, y: Y0 + 14, 'text-anchor': 'middle', fill: 'rgba(159,176,207,.6)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 7.5 }); l.textContent = ch[i]; s.appendChild(l);
      bars.push({ r, alloc: 1 / n, target: 1 / n }); }
    let k = 0, opt = false;
    function setT() { if (!opt) { bars.forEach(b => b.target = 1 / n); status.textContent = 'even split'; } else { const sum = roi.reduce((a, b) => a + b, 0); bars.forEach((b, i) => b.target = roi[i] / sum); status.textContent = 'optimized for ROI'; } }
    setT();
    (function f() { k++; if (k % 300 === 0) { opt = !opt; setT(); }
      let tot = 0;
      bars.forEach((b, i) => { b.alloc += (b.target - b.alloc) * 0.05; const y = yOf(b.alloc); b.r.setAttribute('y', y); b.r.setAttribute('height', Y0 - y); b.r.setAttribute('fill', b.target > 1 / n + 0.001 ? 'rgba(56,189,248,.85)' : 'rgba(159,176,207,.4)'); tot += b.alloc * roi[i]; });
      txt.textContent = 'ROI ' + tot.toFixed(2) + 'x';
      requestAnimationFrame(f);
    })();
  }

  // B — incrementality test: exposed vs holdout conversion builds, then lift + significance revealed
  function mktgB(host) {
    const s = svg(host); const Y0 = 150, Yt = 44, maxCr = 0.1, yOf = c => Y0 - (c / maxCr) * (Y0 - Yt);
    const groups = [{ x: 115, lab: 'Holdout', cr: 0.052, color: 'rgba(159,176,207,.45)' }, { x: 235, lab: 'Exposed', cr: 0.079, color: 'rgba(56,189,248,.85)' }];
    const bw = 56;
    const bars = groups.map(g => { const r = eln('rect', { x: g.x - bw / 2, y: Y0, width: bw, height: 0, rx: 4, fill: g.color }); s.appendChild(r);
      const l = eln('text', { x: g.x, y: Y0 + 16, 'text-anchor': 'middle', fill: 'rgba(159,176,207,.6)', 'font-family': 'JetBrains Mono, monospace', 'font-size': 9 }); l.textContent = g.lab; s.appendChild(l);
      const v = eln('text', { x: g.x, y: Y0, 'text-anchor': 'middle', fill: '#eaf1ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 10 }); s.appendChild(v);
      return { r, v, g }; });
    const brk = eln('path', { fill: 'none', stroke: '#9fe3ff', 'stroke-width': 1.2, opacity: 0 }); s.appendChild(brk);
    const lift = eln('text', { x: 175, y: Yt - 8, 'text-anchor': 'middle', fill: '#9fe3ff', 'font-family': 'JetBrains Mono, monospace', 'font-size': 12, opacity: 0 }); s.appendChild(lift);
    let k = 0, prog = 0;
    (function f() { k++; prog = Math.min(1, prog + 0.012);
      bars.forEach(b => { const c = b.g.cr * prog, y = yOf(c); b.r.setAttribute('y', y); b.r.setAttribute('height', Y0 - y); b.v.setAttribute('y', y - 4); b.v.textContent = (c * 100).toFixed(1) + '%'; });
      if (prog >= 1) { const yE = yOf(groups[1].cr), yH = yOf(groups[0].cr);
        brk.setAttribute('d', `M 235 ${yE - 8} L 235 ${yE - 16} L 115 ${yE - 16} L 115 ${yH - 8}`); brk.setAttribute('opacity', 1);
        lift.setAttribute('opacity', 1); lift.textContent = '+' + ((groups[1].cr / groups[0].cr - 1) * 100).toFixed(0) + '% lift · p<0.05'; }
      if (k % 330 === 0) { prog = 0; brk.setAttribute('opacity', 0); lift.setAttribute('opacity', 0); }
      requestAnimationFrame(f);
    })();
  }

  const MAP = { prodA, prodB, auctionA, auctionB, mktgA, mktgB };
  function panel(type, cap) {
    const w = document.createElement('div'); w.className = 'chartpanel';
    w.innerHTML = `<div class="cap"><b>${cap}</b><span class="live"><span class="dot"></span>live</span></div><div class="cv"></div>`;
    MAP[type](w.querySelector('.cv'));
    return w;
  }
  return { panel };
})();
