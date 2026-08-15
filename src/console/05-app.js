
/* ══════════════════════════════════════════════════════════════════════════
   CONSOLE — state, instruments, screens, presenter controls.
   No training copy below this line.
   ══════════════════════════════════════════════════════════════════════════ */

const $  = id => document.getElementById(id);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Gauges accumulate ±3 per case across eight cases. */
const SCALE = 3 * CASES.length;      /* ±24 */

/* Gauge geometry: a shallow 124° arc whose pivot sits below the viewBox,
   which is what gives it the flat, panel-mounted instrument look. */
const G = { w:200, h:70, cx:100, cy:100, r:80, spread:62, inner:34, outer:76 };

/* ── state ─────────────────────────────────────────────────────────────── */
const state = {
  view:'title',
  idx:0,
  choices:{},          /* caseIndex -> chosen option */
  skipped:{},          /* caseIndex -> true */
  order:{},            /* caseIndex -> shuffled option positions */
  notesOn:false,
  startedAt:null,
  summaryFrom:null,
  resetArmed:false,
  resetTimer:null
};

/* current needle positions, so animation always starts where the eye is */
const shown = { trust:0, signal:0, standard:0, integrity:0 };

/* ── helpers ───────────────────────────────────────────────────────────── */
const sign = v => (v > 0 ? '+' + v : v < 0 ? '−' + Math.abs(v) : '0');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function shuffle(a){
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function reshuffle(){
  CASES.forEach((c, i) => { state.order[i] = shuffle(c.options.map((_, k) => k)); });
}

/* cases that were actually played (a choice was recorded) */
function played(){
  return Object.keys(state.choices).map(Number).sort((a, b) => a - b);
}

function totals(){
  const t = { trust:0, signal:0, standard:0 };
  played().forEach(i => {
    const d = state.choices[i].d;
    t.trust += d.trust; t.signal += d.signal; t.standard += d.standard;
  });
  return t;
}

const totalMinutes = () => played().reduce((s, i) => s + state.choices[i].min, 0);

/* The fastest possible route through the same cases, and what it costs. */
function fastestPath(){
  const idxs = played();
  let min = 0; const g = { trust:0, signal:0, standard:0 }; const picks = [];
  idxs.forEach(i => {
    const best = CASES[i].options.reduce((a, b) => (b.min < a.min ? b : a));
    min += best.min;
    g.trust += best.d.trust; g.signal += best.d.signal; g.standard += best.d.standard;
    picks.push({ i, o:best });
  });
  return { min, g, picks, n:idxs.length };
}

/* Composite: each gauge normalised against the ±3-per-case band it could
   have moved through, then averaged. */
function integrity(){
  const n = played().length;
  if (!n) return null;
  const t = totals(), band = 3 * n;
  const norm = v => (v + band) / (2 * band);
  return Math.round(((norm(t.trust) + norm(t.signal) + norm(t.standard)) / 3) * 100);
}

/* ── gauges ────────────────────────────────────────────────────────────── */
function polar(cx, cy, r, deg){
  const a = deg * Math.PI / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
}

function arcPath(cx, cy, r, a0, a1){
  if (Math.abs(a1 - a0) < 0.01) return '';
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 ${a1 > a0 ? 1 : 0} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function gaugeTicks(){
  return [-SCALE, -SCALE / 2, 0, SCALE / 2, SCALE].map(v => {
    const a = (v / SCALE) * G.spread;
    const major = v === 0;
    const [x0, y0] = polar(G.cx, G.cy, G.r - (major ? 15 : 10), a);
    const [x1, y1] = polar(G.cx, G.cy, G.r + 8, a);
    return `<line class="g-tick${major ? ' g-tick--major' : ''}" x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"/>`;
  }).join('');
}

/* One dial, drawn at a fixed value. The rail's live gauges reuse the same
   geometry and are then animated in place; the summary's larger dials are
   drawn once, already settled. */
function gaugeSvg(label, value, cls){
  const a = (clamp(value, -SCALE, SCALE) / SCALE) * G.spread;
  return `<svg class="${cls}" viewBox="0 0 ${G.w} ${G.h}" role="img" aria-label="${label} gauge">
      <path class="g-track" d="${arcPath(G.cx, G.cy, G.r, -G.spread, G.spread)}"/>
      ${gaugeTicks()}
      <path class="g-active${value < 0 ? ' is-loss' : ''}" d="${arcPath(G.cx, G.cy, G.r, 0, a)}"/>
      <line class="g-needle" x1="${G.cx}" y1="${G.cy - G.inner}" x2="${G.cx}" y2="${G.cy - G.outer}"
            transform="rotate(${a.toFixed(2)} ${G.cx} ${G.cy})"/>
    </svg>`;
}

function buildGauges(){
  $('r-gauges').innerHTML = GAUGES.map(g => `
      <div class="gauge" data-g="${g.id}">
        <div class="gauge__head">
          <span class="gauge__name">${g.name}</span>
          <span class="gauge__val num" data-role="val">0</span>
        </div>
        <svg class="gauge__svg" viewBox="0 0 ${G.w} ${G.h}" role="img"
             aria-label="${g.name} gauge">
          <path class="g-track" d="${arcPath(G.cx, G.cy, G.r, -G.spread, G.spread)}"/>
          ${gaugeTicks()}
          <path class="g-active" data-role="active" d=""/>
          <line class="g-needle" data-role="needle"
                x1="${G.cx}" y1="${G.cy - G.inner}" x2="${G.cx}" y2="${G.cy - G.outer}"/>
        </svg>
        <div class="gauge__note">${g.note}</div>
      </div>`).join('');
}

function paintGauge(id, value){
  const el = document.querySelector(`.gauge[data-g="${id}"]`);
  if (!el) return;
  const a = (clamp(value, -SCALE, SCALE) / SCALE) * G.spread;

  el.querySelector('[data-role="val"]').textContent = sign(Math.round(value));

  const active = el.querySelector('[data-role="active"]');
  active.setAttribute('d', arcPath(G.cx, G.cy, G.r, 0, a));
  active.classList.toggle('is-loss', value < 0);

  const needle = el.querySelector('[data-role="needle"]');
  needle.setAttribute('transform', `rotate(${a.toFixed(2)} ${G.cx} ${G.cy})`);
}

function paintIntegrity(pct){
  const has = pct !== null;
  /* Before anything is played there is no percentage to show — and no unit
     either, so the "%" goes with it. */
  $('r-integrity').innerHTML = has ? Math.round(pct) + '<span class="pct">%</span>' : '—';
  $('r-integrity-bar').style.width = (has ? clamp(pct, 0, 100) : 0) + '%';
}

/* Needles swing past their target and settle. This is the only motion in
   the console, which is why it carries the weight. */
function easeOutBack(t){
  const c1 = 1.70158 * 0.72, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

let raf = null;
function moveInstruments(animate){
  const t = totals();
  const target = {
    trust:t.trust, signal:t.signal, standard:t.standard,
    integrity:integrity()
  };
  const intTarget = target.integrity === null ? 0 : target.integrity;

  $('r-minutes').textContent = totalMinutes();

  if (!animate || REDUCED.matches){
    ['trust','signal','standard'].forEach(k => { shown[k] = target[k]; paintGauge(k, target[k]); });
    shown.integrity = intTarget;
    paintIntegrity(target.integrity);
    return;
  }

  const from = { ...shown };
  const t0 = performance.now(), dur = 900;
  if (raf) cancelAnimationFrame(raf);

  (function step(now){
    const p = clamp((now - t0) / dur, 0, 1);
    const e = easeOutBack(p);
    ['trust','signal','standard'].forEach(k => {
      shown[k] = from[k] + (target[k] - from[k]) * e;
      paintGauge(k, shown[k]);
    });
    /* the composite settles without overshoot — it is a summary, not a needle */
    shown.integrity = from.integrity + (intTarget - from.integrity) * (1 - Math.pow(1 - p, 3));
    paintIntegrity(target.integrity === null ? null : shown.integrity);
    if (p < 1) raf = requestAnimationFrame(step);
    else {
      ['trust','signal','standard'].forEach(k => { shown[k] = target[k]; paintGauge(k, target[k]); });
      shown.integrity = intTarget;
      paintIntegrity(target.integrity);
    }
  })(performance.now());
}

/* ── screens ───────────────────────────────────────────────────────────── */
function show(view){
  state.view = view;
  ['title','case','conseq','summary'].forEach(v => {
    $('screen-' + v).classList.toggle('is-active', v === view);
  });
  /* On the summary the instruments move to centre stage, so the rail steps
     aside and the whole screen fits with nothing to scroll. */
  document.querySelector('.main').classList.toggle('no-rail', view === 'summary');
  syncPresenter();
  syncNotes();
}

function syncPresenter(){
  const inRound = state.view === 'case' || state.view === 'conseq';
  $('p-case').textContent = inRound ? CASES[state.idx].n : (state.view === 'summary' ? String(played().length).padStart(2, '0') : '—');
  $('p-total').textContent = String(CASES.length).padStart(2, '0');
}

function tickClock(){
  if (!state.startedAt){ $('p-clock').textContent = '00:00'; return; }
  const s = Math.floor((Date.now() - state.startedAt) / 1000);
  $('p-clock').textContent =
    String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function loopMarkup(o){
  return LOOP_POINTS.map(p => {
    const broke = (o.breaks || []).includes(p.id);
    const held  = (o.holds  || []).includes(p.id);
    const cls   = broke ? 'is-break' : held ? 'is-hold' : '';
    const word  = broke ? 'Broke' : held ? 'Held' : '—';
    return `<div class="loop__pt ${cls}">
        <div class="loop__state">${word}</div>
        <div class="loop__name">${p.name}</div>
        <div class="loop__where">${p.where}</div>
      </div>`;
  }).join('');
}

function renderCase(i){
  const c = CASES[i];
  state.idx = i;

  $('c-meta').innerHTML =
    `<span class="n num">${c.n}</span>` +
    `<span>${c.title}</span><span class="sep">&middot;</span>` +
    `<span>${c.dept}</span><span class="sep">&middot;</span>` +
    `<span>You are ${c.role}</span>`;

  $('c-setup').textContent  = c.setup;
  $('c-question').textContent = c.question;

  $('c-options').innerHTML = state.order[i].map((oi, pos) => {
    const o = c.options[oi];
    return `<button class="option" type="button" data-pos="${pos}">
        <span class="option__key num">${pos + 1}</span>
        <span class="option__body">
          <span class="option__label">${o.label}</span>
          <span class="option__text">${o.text}</span>
        </span>
      </button>`;
  }).join('');

  show('case');
}

function renderConseq(i){
  const c = CASES[i], o = state.choices[i];
  state.idx = i;

  $('q-lead').textContent = `Case ${c.n} · the room chose`;
  $('q-what').textContent = o.label;
  $('q-said').textContent = o.text;
  $('q-text').innerHTML   = o.conseq;

  const dg = k => {
    const v = o.d[k];
    const cls = v > 0 ? 'delta--gain' : v < 0 ? 'delta--loss' : 'delta--flat';
    return `<div class="delta ${cls}">
        <span class="delta__k">${k}</span><span class="delta__v num">${sign(v)}</span>
      </div>`;
  };
  $('q-movement').innerHTML =
    dg('trust') + dg('signal') + dg('standard') +
    `<div class="delta delta--time">
       <span class="delta__k">Time</span>
       <span class="delta__v num">${o.min} min</span>
     </div>`;

  $('q-loop').innerHTML = loopMarkup(o);
  show('conseq');
  moveInstruments(true);
}

/* ── the four dimensions behind the reading ────────────────────────────────
   Averages hide how a run was actually made, so the summary also reports how
   often a question came before the verdict, how much of it happened in front
   of an audience, whether one line was held, and which of the five points
   gave way. */
function diagnostics(){
  const idxs = played();
  const n = idxs.length;

  /* Only cases that actually offered a question count in the denominator. */
  let askTotal = 0, askTaken = 0;
  CASES.forEach((c, i) => {
    if (!idxs.includes(i)) return;
    if (!c.options.some(o => o.asks)) return;
    askTotal++;
    if (state.choices[i].asks) askTaken++;
  });

  const audience = idxs.filter(i => state.choices[i].audience).length;

  /* Spread of decision quality: the mean hides a swing, and a team lives the
     swing rather than the mean. */
  const q = idxs.map(i => {
    const d = state.choices[i].d;
    return d.trust + d.signal + d.standard;
  });
  const spread = q.length ? Math.max(...q) - Math.min(...q) : 0;

  const breaks = {};
  LOOP_POINTS.forEach(p => { breaks[p.id] = 0; });
  idxs.forEach(i => (state.choices[i].breaks || []).forEach(b => { breaks[b]++; }));
  const worst = LOOP_POINTS
    .map(p => ({ ...p, count: breaks[p.id] }))
    .sort((a, b) => b.count - a.count)[0];

  return { n, askTotal, askTaken, audience, spread, breaks,
           worst: worst && worst.count ? worst : null };
}

/* A reading of this particular run, assembled from the pattern rather than
   picked from a list of fixed verdicts. */
function readOut(dg, fast){
  const n = dg.n;
  if (!n) return 'No cases were played, so there is nothing to read yet.';
  const t = totals();
  const flat = v => Math.abs(v) <= n * 0.5;
  const out = [];

  if (t.trust > 0 && t.signal > 0 && t.standard > 0){
    out.push('All three instruments finished positive. That is the most expensive way through these cases and the only one that compounds — the standard moved without the relationship paying for it.');
  } else if (t.standard > 0 && t.trust <= 0 && t.signal <= 0){
    out.push('Standard rose while Trust and Signal fell. The behaviour changed and the relationship paid for it, which holds for exactly as long as you are watching.');
  } else if (t.trust > 0 && t.standard <= 0){
    out.push('Trust held and Standard did not. Nobody had a bad hour, and nothing about tomorrow is different.');
  } else if (flat(t.trust) && flat(t.signal) && flat(t.standard)){
    out.push('All three instruments finished close to where they started. That usually means the decisions were absorbed rather than made.');
  } else {
    out.push('The three instruments finished pulling in different directions, which is what case-by-case judgement looks like from the outside.');
  }

  if (dg.askTotal){
    if (dg.askTaken === 0){
      out.push(`In the ${dg.askTotal} cases that offered you a question, you went straight to a verdict every time. Asking first is the one move that raises all three instruments at once.`);
    } else if (dg.askTaken === dg.askTotal){
      out.push('You asked before concluding every time a question was available. That is the whole method, and it is why the instruments moved together rather than against each other.');
    } else {
      out.push(`You asked before concluding in ${dg.askTaken} of the ${dg.askTotal} cases that offered a question.`);
    }
  }

  if (dg.worst){
    out.push(`${dg.worst.name} gave way most often — ${dg.worst.count} of your ${n} decisions broke it, at ${dg.worst.where.toLowerCase()}.`);
  }
  if (dg.audience){
    out.push(`${dg.audience} decision${dg.audience === 1 ? '' : 's'} happened where other people could see or hear it. The witnesses learn faster than the person receiving it.`);
  }

  if (dg.spread >= 8){
    out.push('The decisions also swung widely case to case, and a team lives the swing rather than the average.');
  } else if (n >= 3){
    out.push('You held a consistent line across the cases, which is what makes a standard predictable enough to work to.');
  }

  const diff = totalMinutes() - fast.min;
  if (diff > 0) out.push(`It cost ${diff} minute${diff === 1 ? '' : 's'} more than the quickest route.`);

  return out.join(' ');
}

function renderSummary(){
  const idxs = played();
  const n = idxs.length;
  const spent = totalMinutes();
  const fast = fastestPath();
  const t = totals();
  const dg = diagnostics();

  /* the three instruments lead */
  $('s-kpis').innerHTML = GAUGES.map(g => {
    const v = t[g.id];
    const cls = v > 0 ? 'is-gain' : v < 0 ? 'is-loss' : 'is-flat';
    return `<div class="kpi">
        <div class="kpi__top">
          <span class="kpi__k">${g.name}</span>
          <span class="kpi__v ${cls} num">${sign(v)}</span>
        </div>
        ${gaugeSvg(g.id, v, 'kpi__svg')}
        <p class="kpi__d">${g.desc}</p>
      </div>`;
  }).join('');

  const p = pickProfile(fast);
  $('s-profile').textContent = p.name;
  $('s-readout').textContent = readOut(dg, fast);

  const cell = (k, v, sub) =>
    `<div class="diag__c"><span class="diag__k">${k}</span>
       <span class="diag__v num">${v}${sub ? `<small>${sub}</small>` : ''}</span></div>`;
  $('s-diag').innerHTML = n
    ? cell('Asked first', dg.askTotal ? `${dg.askTaken}/${dg.askTotal}` : '—', dg.askTotal ? 'cases' : '')
    + cell('In front of others', dg.audience, `of ${n}`)
    + cell('Consistency', dg.spread >= 8 ? 'Swung' : 'Steady', `spread ${dg.spread}`)
    + cell('Minutes', spent, `vs ${fast.min}`)
    : '';

  const maxB = Math.max(1, ...LOOP_POINTS.map(x => dg.breaks[x.id]));
  $('s-breaks').innerHTML = n ? LOOP_POINTS.map(pt => {
    const c = dg.breaks[pt.id];
    return `<div class="brk${c ? '' : ' is-clean'}">
        <span class="brk__k">${pt.name}</span>
        <span class="brk__t"><span class="brk__f" style="width:${(c / maxB) * 100}%"></span></span>
        <span class="brk__n num">${c || '·'}</span>
      </div>`;
  }).join('') : '';

  $('s-spent').textContent = spent;
  $('s-fast').textContent = fast.min;
  const diff = spent - fast.min;
  $('s-lede').innerHTML = !n ? ''
    : diff > 0
      ? `The quickest route finishes ${diff} minute${diff === 1 ? '' : 's'} sooner and leaves Trust ${sign(fast.g.trust)}, Signal ${sign(fast.g.signal)}, Standard ${sign(fast.g.standard)}.`
      : `You took the quickest route. It leaves Trust ${sign(fast.g.trust)}, Signal ${sign(fast.g.signal)}, Standard ${sign(fast.g.standard)}.`;

  $('s-strip').innerHTML = CASES.map((c, i) => {
    const o = state.choices[i];
    if (!o) return `<div class="strip__c is-skipped">
        <span class="strip__n num">${c.n}</span>
        <span class="strip__pips"></span><span class="strip__t num">—</span></div>`;
    const pips = ['trust','signal','standard'].map(k => {
      const v = o.d[k];
      const h = 2 + Math.abs(v) / 3 * 15;
      return `<span class="pip ${v > 0 ? 'is-gain' : v < 0 ? 'is-loss' : ''}" style="height:${h}px"></span>`;
    }).join('');
    return `<div class="strip__c">
        <span class="strip__n num">${c.n}</span>
        <span class="strip__pips">${pips}</span>
        <span class="strip__t num">${o.min}m</span>
      </div>`;
  }).join('');

  $('s-notes').innerHTML =
    `<div class="notes__k">Facilitator · the fastest path</div>
     <div class="notes__body">` +
    (n ? fast.picks.map(x => `${CASES[x.i].n} ${x.o.label} (${x.o.min} min)`).join(' &middot; ')
       : 'Nothing was played, so there is no comparison to draw.') +
    `</div>
     <div class="notes__map"><span>Ask the room: <b>which of those would you actually defend tomorrow morning?</b></span></div>`;

  show('summary');
  moveInstruments(false);
  fitReadout();
}

/* Step the reading down until it fits its panel. Called after render and on
   resize, so a long run never loses its last sentence off the bottom. */
function fitReadout(){
  const el = $('s-readout');
  const box = el.closest('.panel');
  if (!el || !box) return;
  el.style.fontSize = '';
  let size = parseFloat(getComputedStyle(el).fontSize);
  let guard = 0;
  while (box.scrollHeight > box.clientHeight + 1 && size > 12 && guard++ < 24){
    size -= 0.5;
    el.style.fontSize = size + 'px';
  }
}
window.addEventListener('resize', () => { if (state.view === 'summary') fitReadout(); });

/* ── profile ───────────────────────────────────────────────────────────── */
function pickProfile(fast){
  const idxs = played();
  const n = idxs.length || 1;
  const g = totals();
  const t = g.trust / n, s = g.signal / n, st = g.standard / n;

  let esc = 0, abs = 0;
  idxs.forEach(i => { if (state.choices[i].escalate) esc++; if (state.choices[i].absorb) abs++; });
  const spent = totalMinutes();

  const sc = {
    keeper:    (t > 0 && s > 0 && st > 0) ? 3 + (t + s + st) / 3 : 0,
    enforcer:  (st > 0 && t < 0 && s < 0) ? 3 + st + (-t - s) / 2
             : (st > 0 && (t + s) < 0)    ? 1.5 + st : 0,
    diplomat:  (t > 0 && st < 0) ? 3 + t - st : 0,
    escalator: esc >= 2 ? 2.5 + esc * 1.2 : esc * 1.2,
    absorber:  (Math.abs(t) <= .75 && Math.abs(s) <= .75 && Math.abs(st) <= 1.5 ? 2.5 : 0)
             + (spent <= Math.max(fast.min * 1.5, fast.min + 8) ? 1.5 : 0)
             + abs * 0.9
  };

  let best = 'keeper', bv = -1;
  Object.keys(sc).forEach(k => { if (sc[k] > bv){ bv = sc[k]; best = k; } });
  if (bv <= 0) best = (st >= t && st >= s) ? 'enforcer' : (t >= s ? 'diplomat' : 'absorber');
  return PROFILES[best];
}

/* ── facilitator notes ─────────────────────────────────────────────────── */
function syncNotes(){
  ['c-notes','q-notes','s-notes'].forEach(id => $(id).classList.toggle('is-on', state.notesOn));
  if (state.view !== 'case' && state.view !== 'conseq') return;

  const c = CASES[state.idx];
  /* Which key now selects which authored option — the display order is
     shuffled, so the trainer needs the mapping to follow their own notes. */
  const map = state.order[state.idx]
    .map((oi, pos) => `<span><b>${pos + 1}</b> = ${c.options[oi].id}</span>`).join('');

  const body = c.note
    ? c.note
    : 'No facilitator note for this case. Let the room argue it and move on.';

  const html =
    `<div class="notes__k">Facilitator · case ${c.n}</div>
     <div class="notes__body">${body}</div>
     <div class="notes__map">${map}</div>`;
  $('c-notes').innerHTML = html;
  $('q-notes').innerHTML = html;
}

/* ── navigation ────────────────────────────────────────────────────────── */
function startClock(){ if (!state.startedAt) state.startedAt = Date.now(); }

function choose(pos){
  if (state.view !== 'case') return;
  const i = state.idx;
  const oi = state.order[i][pos];
  if (oi === undefined) return;
  state.choices[i] = CASES[i].options[oi];
  delete state.skipped[i];
  renderConseq(i);
}

function nextFrom(i){
  if (i + 1 < CASES.length) renderCase(i + 1);
  else renderSummary();
}

function advance(){
  startClock();
  if (state.view === 'title')  { renderCase(0); return; }
  if (state.view === 'conseq') { nextFrom(state.idx); return; }
  /* on a case screen a decision is required — S skips it deliberately */
}

function back(){
  if (state.view === 'case'){
    const i = state.idx;
    if (i === 0){ show('title'); return; }
    const prev = i - 1;
    if (state.choices[prev]) { renderConseq(prev); moveInstruments(false); }
    else { delete state.skipped[prev]; renderCase(prev); }
    return;
  }
  if (state.view === 'conseq'){
    delete state.choices[state.idx];
    renderCase(state.idx);
    moveInstruments(true);
    return;
  }
  if (state.view === 'summary'){
    const from = state.summaryFrom;
    state.summaryFrom = null;
    if (from && from.view === 'case') renderCase(from.idx);
    else if (from && from.view === 'conseq'){ renderConseq(from.idx); moveInstruments(false); }
    else {
      const p = played();
      if (p.length){ renderConseq(p[p.length - 1]); moveInstruments(false); }
      else show('title');
    }
  }
}

function skip(){
  if (state.view !== 'case') return;
  state.skipped[state.idx] = true;
  delete state.choices[state.idx];
  moveInstruments(true);
  nextFrom(state.idx);
}

function endRound(){
  if (state.view === 'summary' || state.view === 'title') return;
  state.summaryFrom = { view:state.view, idx:state.idx };
  renderSummary();
}

function armReset(){
  if (state.view === 'title'){ doReset(); return; }
  if (state.resetArmed){ doReset(); return; }
  state.resetArmed = true;
  $('r-reset').innerHTML = 'Press again <kbd>R</kbd>';
  clearTimeout(state.resetTimer);
  state.resetTimer = setTimeout(disarmReset, 2600);
}
function disarmReset(){
  state.resetArmed = false;
  $('r-reset').innerHTML = 'Reset <kbd>R</kbd>';
}
function doReset(){
  disarmReset();
  clearTimeout(state.resetTimer);
  state.choices = {}; state.skipped = {}; state.summaryFrom = null;
  state.idx = 0; state.startedAt = null;
  reshuffle();
  tickClock();
  show('title');
  moveInstruments(false);
}

/* ── presentation bridge ───────────────────────────────────────────────────
   When the console is embedded in the deck it announces itself, so the deck
   knows the frame is live, and hands control back on Escape. Local-file
   frames are cross-origin, which is why this goes over postMessage. Running
   standalone, EMBEDDED is false and none of this does anything. */
const EMBEDDED = (() => { try { return window.parent !== window; } catch (e) { return true; } })();

function tellDeck(type){
  if (!EMBEDDED) return;
  try { window.parent.postMessage({ type }, '*'); } catch (e) {}
}

/* ── input ─────────────────────────────────────────────────────────────── */
const NAV_KEYS = [' ', 'Spacebar', 'ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'];

document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;

  if (NAV_KEYS.includes(k)) e.preventDefault();

  if (k === 'ArrowRight' || k === ' ' || k === 'Spacebar' || k === 'PageDown'){ advance(); return; }
  if (k === 'ArrowLeft'  || k === 'PageUp'){ back(); return; }
  if (k >= '1' && k <= '4'){ startClock(); choose(Number(k) - 1); return; }
  if (k === 'Escape'){ tellDeck('broken-loop:return'); return; }

  switch (k.toLowerCase()){
    case 's': startClock(); skip(); break;
    case 'e': endRound(); break;
    case 'n': state.notesOn = !state.notesOn; syncNotes(); break;
    case 'r': armReset(); break;
  }
});

$('c-options').addEventListener('click', e => {
  const b = e.target.closest('.option');
  if (!b) return;
  startClock();
  choose(Number(b.dataset.pos));
});

$('r-reset').addEventListener('click', armReset);

/* ── boot ──────────────────────────────────────────────────────────────── */
function buildLegend(){
  const ico = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
  $('legend').innerHTML = [
    [`<kbd>${ico('i-right')}</kbd><kbd>space</kbd>`, 'advance'],
    [`<kbd>${ico('i-left')}</kbd>`,                  'back'],
    ['<kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd>', 'choose'],
    ['<kbd>S</kbd>', 'skip'],
    ['<kbd>E</kbd>', 'end'],
    ['<kbd>N</kbd>', 'notes'],
    ['<kbd>R</kbd>', 'reset']
  ].map(([keys, label]) =>
    `<span class="legend__item">${keys}<span>${label}</span></span>`).join('');
}

buildGauges();
buildLegend();
reshuffle();
moveInstruments(false);
tickClock();
setInterval(tickClock, 1000);
show('title');
tellDeck('broken-loop:ready');
