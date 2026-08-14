
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

function buildGauges(){
  $('r-gauges').innerHTML = GAUGES.map(g => {
    const ticks = [-SCALE, -SCALE / 2, 0, SCALE / 2, SCALE].map(v => {
      const a = (v / SCALE) * G.spread;
      const major = v === 0;
      const [x0, y0] = polar(G.cx, G.cy, G.r - (major ? 15 : 10), a);
      const [x1, y1] = polar(G.cx, G.cy, G.r + 8, a);
      return `<line class="g-tick${major ? ' g-tick--major' : ''}" x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"/>`;
    }).join('');

    return `
      <div class="gauge" data-g="${g.id}">
        <div class="gauge__head">
          <span class="gauge__name">${g.name}</span>
          <span class="gauge__val num" data-role="val">0</span>
        </div>
        <svg class="gauge__svg" viewBox="0 0 ${G.w} ${G.h}" role="img"
             aria-label="${g.name} gauge">
          <path class="g-track" d="${arcPath(G.cx, G.cy, G.r, -G.spread, G.spread)}"/>
          ${ticks}
          <path class="g-active" data-role="active" d=""/>
          <line class="g-needle" data-role="needle"
                x1="${G.cx}" y1="${G.cy - G.inner}" x2="${G.cx}" y2="${G.cy - G.outer}"/>
        </svg>
        <div class="gauge__note">${g.note}</div>
      </div>`;
  }).join('');
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

function renderSummary(){
  const idxs = played();
  const n = idxs.length;
  const spent = totalMinutes();
  const fast = fastestPath();
  const t = totals();

  $('s-spent').textContent = spent;
  $('s-fast').textContent  = fast.min;

  const diff = spent - fast.min;
  const scope = n === CASES.length ? 'these eight cases' : `the ${n} case${n === 1 ? '' : 's'} you played`;
  $('s-lede').innerHTML = !n
    ? 'No cases were played.'
    : diff > 0
      ? `<b>${diff} minute${diff === 1 ? '' : 's'}</b> separate the two columns. That is the entire price of the difference between them — and it is the only part of this that a calendar can see.`
      : `You took the quickest route through ${scope}. The right-hand column is what that route leaves behind.`;

  /* Each column states what its own route leaves on the instruments, so the
     trade between minutes and everything else is legible in one glance. */
  const row = g => ['trust','signal','standard'].map(k => {
    const v = g[k];
    return `<div class="vr">
        <span class="vr__k">${k}</span>
        <span class="vr__v ${v > 0 ? 'is-gain' : v < 0 ? 'is-loss' : 'is-flat'} num">${sign(v)}</span>
      </div>`;
  }).join('');
  $('s-yours').innerHTML = n ? row(t) : '';
  $('s-fastg').innerHTML = n ? row(fast.g) : '';

  /* per-case strip — where the room's choices landed */
  $('s-strip').innerHTML = CASES.map((c, i) => {
    const o = state.choices[i];
    if (!o) return `<div class="strip__c is-skipped">
        <span class="strip__n num">${c.n}</span>
        <span class="strip__l">${state.skipped[i] ? 'Skipped' : 'Not played'}</span>
        <span class="strip__pips"></span><span class="strip__t num">—</span>
      </div>`;
    const pips = ['trust','signal','standard'].map(k => {
      const v = o.d[k];
      const h = 2 + Math.abs(v) / 3 * 22;
      return `<span class="pip ${v > 0 ? 'is-gain' : v < 0 ? 'is-loss' : ''}" style="height:${h}px"></span>`;
    }).join('');
    return `<div class="strip__c">
        <span class="strip__n num">${c.n}</span>
        <span class="strip__l">${o.label}</span>
        <span class="strip__pips">${pips}</span>
        <span class="strip__t num">${o.min} min</span>
      </div>`;
  }).join('');

  const p = pickProfile(fast);
  $('s-profile').textContent = p.name;
  $('s-profile-line').textContent = p.line;

  $('s-notes').innerHTML =
    `<div class="notes__k">Facilitator · the fastest path</div>
     <div class="notes__body">` +
    (n ? fast.picks.map(x => `${CASES[x.i].n} ${x.o.label} (${x.o.min} min)`).join(' &middot; ')
       : 'Nothing was played, so there is no comparison to draw.') +
    `</div>
     <div class="notes__map"><span>Ask the room: <b>which of those would you actually defend tomorrow morning?</b></span></div>`;

  show('summary');
  moveInstruments(false);
}

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

/* ── input ─────────────────────────────────────────────────────────────── */
const NAV_KEYS = [' ', 'Spacebar', 'ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'];

document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;

  if (NAV_KEYS.includes(k)) e.preventDefault();

  if (k === 'ArrowRight' || k === ' ' || k === 'Spacebar' || k === 'PageDown'){ advance(); return; }
  if (k === 'ArrowLeft'  || k === 'PageUp'){ back(); return; }
  if (k >= '1' && k <= '4'){ startClock(); choose(Number(k) - 1); return; }

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
