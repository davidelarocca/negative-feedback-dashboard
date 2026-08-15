
/* ══════════════════════════════════════════════════════════════════════════
   ENGINE — canvas scaling, reveals, the rail, the inversion, the handoff.
   No presentation copy below this line.
   ══════════════════════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

const CONSOLE_FILE = 'broken-loop.html';
const INVERT_MS = 700;

let idx = 0;          /* slide index */
let step = 0;         /* reveal step within the slide */
let dark = false;     /* current ground */
let notesOn = false;
let startedAt = null;
let consoleReady = false;
let consoleMode = null;   /* null | 'frame' | 'tab' */

/* ── 1. the design canvas ──────────────────────────────────────────────────
   1280×720 scaled to the viewport, recalculated on load and on resize, so
   1920×1080 and 1366×768 are the same picture at two sizes. */
function fit(){
  const s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
  $('canvas').style.transform = `translate(-50%,-50%) scale(${s})`;
}
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', fit);

/* ── 2. build ──────────────────────────────────────────────────────────── */
function build(){
  $('slides').innerHTML = SLIDES.map((s, i) => `
    <section class="slide${s.center ? ' is-center' : ''}${s.rail ? ' has-rail' : ''}${s.cls ? ' ' + s.cls : ''}"
             data-i="${i}" aria-label="Slide ${s.n}">${s.html}</section>`).join('');

  $('rail').innerHTML = RAIL.map(name => `
    <div class="rail__seg">
      <div class="rail__bar"></div>
      <div class="rail__lbl">${name}</div>
    </div>`).join('');
}

/* ── 3. reveals ────────────────────────────────────────────────────────── */
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

function stagger(el){
  const v = getComputedStyle(el).getPropertyValue('--i');
  return (parseFloat(v) || 0) * 80;
}

function applyStep(slideEl, animate){
  slideEl.querySelectorAll('[data-step]').forEach(el => {
    const show = +el.dataset.step <= step;
    if (!show && el.classList.contains('shown')) resetCounts(el);
    el.classList.toggle('shown', show);
  });

  /* elements that step aside once the argument has moved past them */
  slideEl.querySelectorAll('[data-until]').forEach(el => {
    el.classList.toggle('faded', step > +el.dataset.until);
  });

  slideEl.querySelectorAll('[data-step].shown').forEach(el => {
    const delay = animate ? stagger(el) : 0;
    const nodes = el.matches('[data-count]') ? [el] : el.querySelectorAll('[data-count]');
    nodes.forEach(n => {
      if (n.dataset.done === '1') return;
      if (delay) setTimeout(() => countUp(n, animate), delay);
      else countUp(n, animate);
    });
  });
}

/* ── 4. the rail ───────────────────────────────────────────────────────── */
function setRail(pos){
  const rail = $('rail');
  rail.classList.toggle('on', pos > 0);
  [...rail.children].forEach((seg, i) => {
    const n = i + 1;
    const all = pos === 5;                       /* slide 11: all five lit */
    seg.classList.toggle('is-now',  all || n === pos);
    seg.classList.toggle('is-past', !all && n < pos);
  });
}

/* ── 5. the inversion ──────────────────────────────────────────────────────
   The deck is dark from the moment it arrives at slide 18 until slide 19
   takes its first step. Deriving it from position rather than tracking it
   as an event means every route — forward, back, reset — lands correctly. */
function wantsDark(i, s){
  const n = SLIDES[i].n;
  return n === '18' || (n === '19' && s === 0);
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

/* ── 6. navigation ─────────────────────────────────────────────────────── */
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
  if (prev !== idx) resetCounts($('slides').children[idx]);
  render(animate);
}

function setStep(s){
  step = s;
  render(true);
}

function advance(){
  startClock();
  if (consoleMode) return;                 /* the console has the floor */
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
  if (step > 0){ setStep(step - 1); return; }
  if (idx > 0){
    const prev = SLIDES[idx - 1];
    go(idx - 1, prev.steps);
  }
}

/* ── 7. the handoff ────────────────────────────────────────────────────────
   Preferred route is the embedded frame, so the presenter never leaves the
   deck. Local-file frames are cross-origin, so the console announces itself
   with postMessage; if that handshake never arrives the frame is not usable
   and we open the console in a tab instead rather than showing a dead frame. */
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
    $('p-hint').textContent = 'Esc returns to the deck';
    setTimeout(() => { try { frame.contentWindow.focus(); } catch (err) {} }, 80);
  } else {
    /* The frame never announced itself, so it is not usable. Open the console
       in a tab instead of leaving a dead frame on screen. */
    consoleMode = 'tab';
    $('p-hint').textContent = 'Esc returns to the deck';
    const win = window.open(CONSOLE_FILE, '_blank');
    if (!win){
      /* Popup blocked — tell the presenter rather than failing silently. */
      const note = document.getElementById('handoff-fallback');
      if (note) note.classList.add('on');
    }
  }
}

function returnFromConsole(){
  const frame = $('console');
  frame.classList.remove('on');
  consoleMode = null;
  $('p-hint').textContent = 'N notes · F full screen';
  /* Slide 19 opens on the dark ground, which is the colour already on
     screen, so nothing flashes as the console goes. */
  go(SLIDES.findIndex(s => s.n === '19'), 0);
  window.focus();
}

/* ── 8. presenter chrome ───────────────────────────────────────────────── */
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
/* Sampled well inside the second so the displayed minute never lags the
   real one on a shared screen. */
setInterval(tickClock, 250);

function toggleNotes(){
  notesOn = !notesOn;
  $('notes').classList.toggle('on', notesOn);
}

function toggleFull(){
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function reset(){
  if (consoleMode){ $('console').classList.remove('on'); consoleMode = null; }
  $('p-hint').textContent = 'N notes · F full screen';
  startedAt = null;
  $('p-clock').textContent = '00:00';
  [...$('slides').children].forEach(resetCounts);
  notesOn = false; $('notes').classList.remove('on');
  go(0, 0, false);
}

/* ── 9. input ──────────────────────────────────────────────────────────── */
const NAV = [' ', 'Spacebar', 'ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'];

document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (NAV.includes(k)) e.preventDefault();

  if (k === 'ArrowRight' || k === ' ' || k === 'Spacebar' || k === 'PageDown'){ advance(); return; }
  if (k === 'ArrowLeft'  || k === 'PageUp'){ back(); return; }
  if (k === 'Escape'){
    if (consoleMode) returnFromConsole();
    else if (notesOn) toggleNotes();
    return;
  }
  switch (k.toLowerCase()){
    case 'n': toggleNotes(); break;
    case 'f': toggleFull(); break;
    case 'r': reset(); break;
  }
});

/* Click advances, except on the notes panel and the presenter strip. */
$('canvas').addEventListener('click', e => {
  if (e.target.closest('.notes') || e.target.closest('.presenter')) return;
  advance();
});

/* ── 10. boot ──────────────────────────────────────────────────────────── */
build();
fit();
render(false);

/* Preload the console so the handoff has nothing left to load. */
$('console').src = CONSOLE_FILE;
