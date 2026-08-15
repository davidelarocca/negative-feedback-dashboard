
/* ══════════════════════════════════════════════════════════════════════════
   ENGINE — canvas scaling, reveal primitives, the rail, the inversion,
   the handoff. No presentation copy below this line.
   ══════════════════════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

const CONSOLE_FILE = 'broken-loop.html';

/* In the single-file build this holds the whole dashboard, base64 encoded,
   and the frame is fed from it instead of from a sibling file. In the
   two-file build it is empty and the frame loads broken-loop.html. One
   source, both outputs. */
const DASHBOARD_B64 = '__DASHBOARD_B64__';

function dashboardHtml(){
  if (!DASHBOARD_B64) return null;
  const bytes = Uint8Array.from(atob(DASHBOARD_B64), c => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);   /* the copy is UTF-8 */
}
const INVERT_MS = 700;
const WORD_MS = 46;        /* per-word delay in a kinetic split */

let idx = 0, step = 0;
let dark = false, notesOn = false, helpOn = false;
let startedAt = null;
let consoleReady = false;
let consoleMode = null;    /* null | 'frame' | 'tab' */

/* ── 1. the design canvas ────────────────────────────────────────────────── */
function fit(){
  const s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
  $('canvas').style.transform = `translate(-50%,-50%) scale(${s})`;
}
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', fit);

/* ── 2. build + reveal preparation ───────────────────────────────────────────
   Prose is masked: the element clips its own content and an inner span rises
   from behind the edge. Objects lift as a group. Rules and arcs draw. Each
   step's targets get an incremental --i so a group assembles rather than
   arriving whole. */
const INLINE = new Set(['SPAN','B','STRONG','EM','I','BR','SUP','SUB','A']);

function isTextLeaf(el){
  if (!el.textContent.trim()) return false;
  if (el.namespaceURI === 'http://www.w3.org/2000/svg') return false;
  /* A flex or grid box is a layout container even when every child is a
     span. Masking it would collapse the row into a single block. */
  const d = getComputedStyle(el).display;
  if (d === 'flex' || d === 'grid' || d === 'inline-flex' || d === 'inline-grid') return false;
  return [...el.children].every(c => INLINE.has(c.tagName));
}

function maskify(el){
  if (el.dataset.masked) return;
  el.dataset.masked = '1';
  el.classList.add('masked');
  const inner = document.createElement('span');
  inner.className = 'rv';
  while (el.firstChild) inner.appendChild(el.firstChild);
  el.appendChild(inner);
}

/* Hero lines only: each word carries its own mask and delay, so the sentence
   assembles itself left to right. */
function splitWords(el){
  const text = el.textContent;
  el.textContent = '';
  let n = 0;
  text.split(/(\s+)/).forEach(tok => {
    if (!tok) return;
    if (!tok.trim()){ el.appendChild(document.createTextNode(tok)); return; }
    const w = document.createElement('span'); w.className = 'w';
    const i = document.createElement('i');
    i.textContent = tok;
    i.style.transitionDelay = (n++ * WORD_MS) + 'ms';
    w.appendChild(i);
    el.appendChild(w);
  });
}

function prepare(root){
  root.querySelectorAll('[data-step]').forEach(stepEl => {
    let i = 0;
    const assign = el => {
      if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i);
      i++;
    };
    const take = el => {
      if (el.dataset.split === 'words'){ splitWords(el); assign(el); return true; }
      if (el.classList.contains('rule') || el.classList.contains('lift')
          || el.classList.contains('sp-arc')){ assign(el); return true; }
      if (isTextLeaf(el)){ maskify(el); assign(el); return true; }
      return false;
    };
    const visit = node => {
      for (const c of node.children){
        if (c.hasAttribute('data-step')) continue;   /* another step owns it */
        if (!take(c)) visit(c);
      }
    };
    if (stepEl.dataset.split === 'words') splitWords(stepEl);
    else if (stepEl.classList.contains('lift')) { /* lifts as one group */ }
    else if (isTextLeaf(stepEl)) maskify(stepEl);
    else visit(stepEl);
  });
}

function build(){
  $('slides').innerHTML = SLIDES.map((s, i) => `
    <section class="slide${s.center ? ' is-center' : ''}${s.rail ? ' has-rail' : ''}${s.cls ? ' ' + s.cls : ''}"
             data-i="${i}" aria-label="Slide ${s.n}">${s.html}</section>`).join('');

  $('rail').innerHTML = RAIL.map(name => `
    <div class="rail__seg">
      <div class="rail__bar"></div>
      <div class="rail__lbl">${name}</div>
    </div>`).join('');

  $('p-total').textContent = String(SLIDES.length).padStart(2, '0');
  prepare($('slides'));
}

/* ── 3. counting ─────────────────────────────────────────────────────────── */
function countUp(node, animate){
  if (node.dataset.done === '1') return;
  node.dataset.done = '1';
  const target = +node.dataset.count;
  const suffix = node.dataset.suffix || '';
  if (!animate || REDUCED.matches || target === 0){
    node.textContent = target + suffix;
    return;
  }
  const t0 = performance.now();
  (function tick(now){
    const p = Math.min((now - t0) / 900, 1);
    const e = 1 - Math.pow(1 - p, 3);
    node.textContent = Math.round(target * e) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else node.textContent = target + suffix;
  })(performance.now());
}

function resetCounts(scope){
  scope.querySelectorAll('[data-count]').forEach(n => {
    n.dataset.done = '';
    n.textContent = '0' + (n.dataset.suffix || '');
  });
}

function applyStep(slideEl, animate){
  slideEl.querySelectorAll('[data-step]').forEach(el => {
    const show = +el.dataset.step <= step;
    if (!show && el.classList.contains('shown')) resetCounts(el);
    el.classList.toggle('shown', show);
  });

  slideEl.querySelectorAll('[data-until]').forEach(el => {
    el.classList.toggle('faded', step > +el.dataset.until);
  });

  slideEl.querySelectorAll('[data-step].shown').forEach(el => {
    const i = parseFloat(getComputedStyle(el).getPropertyValue('--i')) || 0;
    const nodes = el.matches('[data-count]') ? [el] : el.querySelectorAll('[data-count]');
    nodes.forEach(n => {
      if (n.dataset.done === '1') return;
      const delay = animate ? i * 90 + 160 : 0;
      if (delay) setTimeout(() => countUp(n, animate), delay);
      else countUp(n, animate);
    });
  });
}

/* ── 4. the rail ─────────────────────────────────────────────────────────── */
function setRail(pos){
  const rail = $('rail');
  rail.classList.toggle('on', pos > 0);
  [...rail.children].forEach((seg, i) => {
    const n = i + 1;
    const all = pos === 5;                       /* the last one lights all five */
    seg.classList.toggle('is-now',  all || n === pos);
    seg.classList.toggle('is-past', !all && n < pos);
  });
}

/* ── 5. the inversion ────────────────────────────────────────────────────────
   Derived from slide flags rather than slide numbers, so inserting a slide
   never moves it, and every route — forward, back, reset, returning from the
   dashboard — lands on the right ground. */
function wantsDark(i, s){
  const sl = SLIDES[i];
  if (sl.handoffAt) return true;          /* dark for the whole handoff slide */
  if (sl.arriveDark) return s === 0;      /* dark on arrival, inverts on step 1 */
  return false;
}

let invertTimer = null;
function setGround(next, animate){
  if (next === dark) return;
  dark = next;
  if (animate && !REDUCED.matches){
    document.body.classList.add('inverting');
    clearTimeout(invertTimer);
    invertTimer = setTimeout(() => document.body.classList.remove('inverting'), INVERT_MS + 60);
  }
  document.body.classList.toggle('is-dark', dark);
}

/* ── 6. navigation ───────────────────────────────────────────────────────── */
function render(animate){
  const s = SLIDES[idx];
  const slides = $('slides').children;

  [...slides].forEach((el, i) => el.classList.toggle('is-active', i === idx));
  applyStep(slides[idx], animate);
  setRail(s.rail || 0);
  setGround(wantsDark(idx, step), animate);

  $('p-n').textContent = s.n;
  $('notes-k').textContent = 'Slide ' + s.n;
  $('notes-b').innerHTML = s.notes || '';
}

function go(i, s, animate = true){
  const prev = idx;
  idx = Math.max(0, Math.min(SLIDES.length - 1, i));
  step = s;
  if (prev !== idx){
    resetCounts($('slides').children[idx]);
    /* restart the slide-entry motion */
    const el = $('slides').children[idx];
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  }
  render(animate);
}

function setStep(s){ step = s; render(true); }

function advance(){
  startClock();
  if (consoleMode) return;                 /* the dashboard has the floor */
  if (helpOn){ toggleHelp(); return; }
  const s = SLIDES[idx];
  if (step < s.steps){
    setStep(step + 1);
    if (s.handoffAt && step === s.handoffAt) handoff();
  } else if (idx < SLIDES.length - 1){
    go(idx + 1, 0);
  }
}

function back(){
  startClock();
  if (consoleMode){ returnFromConsole(); return; }
  if (helpOn){ toggleHelp(); return; }
  if (step > 0){ setStep(step - 1); return; }
  if (idx > 0) go(idx - 1, SLIDES[idx - 1].steps);
}

/* ── 7. the handoff ──────────────────────────────────────────────────────── */
window.addEventListener('message', e => {
  const d = e.data;
  if (!d || typeof d !== 'object') return;
  if (d.type === 'broken-loop:ready') consoleReady = true;
  if (d.type === 'broken-loop:return') returnFromConsole();
});

function handoff(){
  const frame = $('console');
  if (consoleReady){
    consoleMode = 'frame';
    frame.classList.add('on');
    setTimeout(() => { try { frame.contentWindow.focus(); } catch (err) {} }, 80);
  } else {
    /* The frame never announced itself, so it is not usable. Open the
       dashboard in a tab rather than leaving a dead frame on screen. In the
       single-file build there is no sibling file to open, so it goes out as
       a blob built from the copy carried inside this page. */
    consoleMode = 'tab';
    const html = dashboardHtml();
    const target = html
      ? URL.createObjectURL(new Blob([html], { type: 'text/html' }))
      : CONSOLE_FILE;
    const win = window.open(target, '_blank');
    if (!win){
      const note = $('handoff-fallback');
      if (note) note.classList.add('on');
    }
  }
}

function returnFromConsole(){
  $('console').classList.remove('on');
  consoleMode = null;
  /* The slide that opens on the dark ground is the colour already on screen,
     so nothing flashes as the dashboard goes. */
  go(SLIDES.findIndex(s => s.arriveDark), 0);
  window.focus();
}

/* ── 8. presenter chrome ─────────────────────────────────────────────────── */
function startClock(){
  if (startedAt) return;
  startedAt = Date.now();
  tickClock();
}
function tickClock(){
  if (!startedAt) return;
  const t = Math.floor((Date.now() - startedAt) / 1000);
  $('p-clock').textContent =
    String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
}
setInterval(tickClock, 250);

function toggleNotes(){
  notesOn = !notesOn;
  $('notes').classList.toggle('on', notesOn);
}

function toggleHelp(){
  helpOn = !helpOn;
  $('help').classList.toggle('on', helpOn);
}

function toggleFull(){
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function reset(){
  if (consoleMode){ $('console').classList.remove('on'); consoleMode = null; }
  startedAt = null;
  $('p-clock').textContent = '00:00';
  [...$('slides').children].forEach(resetCounts);
  notesOn = false; $('notes').classList.remove('on');
  helpOn = false;  $('help').classList.remove('on');
  go(0, 0, false);
}

/* ── 9. input ────────────────────────────────────────────────────────────── */
const NAV = [' ', 'Spacebar', 'ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'];

document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (NAV.includes(k)) e.preventDefault();

  if (k === 'ArrowRight' || k === ' ' || k === 'Spacebar' || k === 'PageDown'){ advance(); return; }
  if (k === 'ArrowLeft'  || k === 'PageUp'){ back(); return; }
  if (k === 'Escape'){
    if (consoleMode) returnFromConsole();
    else if (helpOn) toggleHelp();
    else if (notesOn) toggleNotes();
    return;
  }
  switch (k.toLowerCase()){
    case 'n': toggleNotes(); break;
    case 'h': toggleHelp(); break;
    case 'f': toggleFull(); break;
    case 'r': reset(); break;
  }
});

$('canvas').addEventListener('click', e => {
  if (e.target.closest('.notes') || e.target.closest('.presenter')) return;
  if (e.target.closest('.help')){ toggleHelp(); return; }
  advance();
});

/* ── 10. boot ────────────────────────────────────────────────────────────── */
build();
fit();
render(false);

/* Preload the dashboard so the handoff has nothing left to load. */
const embedded = dashboardHtml();
if (embedded) $('console').srcdoc = embedded;
else $('console').src = CONSOLE_FILE;
