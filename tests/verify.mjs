/**
 * Verification suite for both halves of the session.
 *
 *   npm install && npm test
 *
 * Drives the built files in a real browser rather than inspecting source,
 * because everything worth checking here is a rendered property: whether a
 * line fits its box, whether the two grounds are the same colour, whether a
 * key reaches the frame that has focus.
 *
 * Set PW_CHROMIUM to use a pre-installed browser instead of Playwright's own.
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DASH = 'file://' + path.join(ROOT, 'broken-loop.html');
const DECK = 'file://' + path.join(ROOT, 'broken-loop-deck.html');
const SESSION = 'file://' + path.join(ROOT, 'broken-loop-session.html');

/* Real presentation windows, down to the smallest worth supporting. */
const SIZES = [[1920, 1080], [1680, 1050], [1536, 864], [1470, 956], [1440, 900],
               [1366, 768], [1280, 800], [1280, 720], [1194, 834], [1152, 720],
               [1100, 800], [1024, 768], [1024, 640]];

let passed = 0;
const failures = [];

function check(name, ok, detail = '') {
  if (ok) { passed++; console.log(`  ok   ${name}`); }
  else { failures.push(`${name}${detail ? ' — ' + detail : ''}`); console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`); }
}

const browser = await chromium.launch(
  process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {}
);

/** A page that records page errors and any request leaving the file. */
async function open(url, viewport, opts = {}) {
  const page = await browser.newPage({ viewport, ...opts });
  page.errors = [];
  page.external = [];
  page.on('pageerror', e => page.errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') page.errors.push(m.text()); });
  page.on('request', r => {
    const u = r.url();
    if (!u.startsWith('file://') && !u.startsWith('data:') && !u.startsWith('about:')) page.external.push(u);
  });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  return page;
}

const press = async (p, key, ms = 140) => { await p.keyboard.press(key); await p.waitForTimeout(ms); };

/* ══════════════════════════════════════════════════════════════════════════
   1. DASHBOARD
   ══════════════════════════════════════════════════════════════════════════ */
console.log('\nDASHBOARD');
{
  const p = await open(DASH, { width: 1920, height: 1080 });

  const meta = await p.evaluate(() => ({
    title: document.querySelector('.lockup__text').textContent.trim(),
    fonts: [...new Set([...document.fonts].map(f => f.family))],
    logo: document.querySelector('.lockup__mark').naturalWidth > 0
  }));
  check('header reads Feedback Management Dashboard', meta.title.startsWith('Feedback Management Dashboard'), meta.title);
  check('Poppins is the only typeface', meta.fonts.length === 1 && meta.fonts[0] === 'Poppins', meta.fonts.join(','));
  check('Costa mark is embedded and decodes', meta.logo);

  /* Only one screen may render. A class re-declaring display:flex beats
     .screen{display:none} on source order, which left the summary's panels
     showing underneath every other screen. */
  const onlyOne = async () => p.evaluate(() =>
    ['title','case','conseq','summary']
      .filter(v => getComputedStyle(document.getElementById('screen-' + v)).display !== 'none')
      .join(','));
  check('only the active screen renders (title)', await onlyOne() === 'title', await onlyOne());

  /* a full round, then back out of it again */
  await press(p, 'ArrowRight');
  await press(p, '1', 900);
  const after = await p.evaluate(() => document.getElementById('r-minutes').textContent);
  await press(p, 'ArrowLeft', 900);
  const undone = await p.evaluate(() => document.getElementById('r-minutes').textContent);
  check('back undoes a recorded decision', undone === '0', `after=${after} undone=${undone}`);
  check('only the active screen renders (case)', await onlyOne() === 'case', await onlyOne());

  await press(p, '1', 900);
  for (let i = 0; i < 7; i++) { await press(p, 'ArrowRight'); await press(p, '1', 900); }
  await press(p, 'ArrowRight', 500);

  const sum = await p.evaluate(() => ({
    view: document.querySelector('.screen.is-active').id,
    kpis: document.querySelectorAll('.kpi').length,
    breaks: document.querySelectorAll('.brk').length,
    diag: document.querySelectorAll('.diag__c').length,
    readout: document.getElementById('s-readout').textContent.length,
    fast: document.getElementById('s-fast').textContent
  }));
  check('summary leads with three instruments', sum.view === 'screen-summary' && sum.kpis === 3);
  check('all five break points reported', sum.breaks === 5);
  check('four diagnostic dimensions', sum.diag === 4);
  check('a tailored reading is generated', sum.readout > 120, `${sum.readout} chars`);
  check('fastest path over eight cases is 17 minutes', sum.fast === '17', sum.fast);
  check('only the active screen renders (summary)', await onlyOne() === 'summary', await onlyOne());

  /* reset asks twice mid-session */
  await press(p, 'r');
  const armed = await p.evaluate(() => document.getElementById('r-reset').textContent.includes('again'));
  await press(p, 'r', 400);
  const cleared = await p.evaluate(() => document.getElementById('r-minutes').textContent === '0');
  check('reset requires a second press, then clears', armed && cleared);

  check('dashboard makes no external request', p.external.length === 0, p.external.join(','));
  check('dashboard runs without errors', p.errors.length === 0, p.errors.join(' | '));
  await p.close();
}

/* skip and end-early use only the cases actually played */
{
  const p = await open(DASH, { width: 1920, height: 1080 });
  await press(p, 'ArrowRight');
  await press(p, 's', 250);
  await press(p, '1', 900);
  await press(p, 'e', 400);
  const partial = await p.evaluate(() => ({
    view: document.querySelector('.screen.is-active').id,
    skipped: document.querySelectorAll('.strip__c.is-skipped').length
  }));
  check('skip and end early summarise only what was played', partial.view === 'screen-summary' && partial.skipped === 7,
    JSON.stringify(partial));
  await p.close();
}

/* one screen, no scrolling, nothing escaping a panel */
console.log('\nDASHBOARD · fits one screen');
for (const [w, h] of SIZES) {
  const p = await open(DASH, { width: w, height: h });
  await press(p, 'ArrowRight');
  const railFits = await p.evaluate(() => {
    const s = document.querySelector('.rail__scroll');
    return s.scrollHeight <= s.clientHeight + 2;
  });
  const notes = await p.evaluate(() =>
    [...document.querySelectorAll('.gauge__note')].every(n => getComputedStyle(n).display !== 'none'));

  const caseEsc = await p.evaluate(() => {
    const st = document.querySelector('.stage'), cs = getComputedStyle(st), r = st.getBoundingClientRect();
    const bottom = r.bottom - parseFloat(cs.paddingBottom);
    const out = [];
    st.querySelectorAll('*').forEach(n => {
      const q = n.getBoundingClientRect();
      if (!q.height || !(n.textContent || '').trim()) return;
      if (q.bottom > bottom + 2) out.push((n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 20));
    });
    return [...new Set(out)];
  });

  for (let i = 0; i < 8; i++) { await press(p, '1', 90); await press(p, 'ArrowRight', 90); }
  await p.waitForTimeout(450);

  const fit = await p.evaluate(() => {
    const escapes = [];
    document.querySelectorAll('#screen-summary .panel, #screen-summary .kpi').forEach(pl => {
      const cs = getComputedStyle(pl), r = pl.getBoundingClientRect();
      const bottom = r.bottom - parseFloat(cs.paddingBottom);
      const right = r.right - parseFloat(cs.paddingRight);
      pl.querySelectorAll('*').forEach(n => {
        const q = n.getBoundingClientRect();
        if (!q.height || !(n.textContent || '').trim()) return;
        if (q.bottom > bottom + 1.5 || q.right > right + 1.5) escapes.push((n.textContent || '').trim().slice(0, 24));
      });
    });
    const sc = document.getElementById('screen-summary');
    return {
      escapes: [...new Set(escapes)],
      scrolls: sc.scrollHeight > sc.clientHeight + 2,
      page: document.body.scrollHeight > document.documentElement.clientHeight + 1
        || document.body.scrollWidth > document.documentElement.clientWidth + 1
    };
  });
  check(`${w}x${h} rail fits and keeps its captions`, railFits && notes);
  /* At 1180 and below the rail moves to a strip under the stage and the
     layout is explicitly a fallback: it may scroll rather than clip. Above
     that, nothing may leave the stage. */
  if (w > 1180) check(`${w}x${h} case screen stays inside the stage`, caseEsc.length === 0, caseEsc.join(' / '));
  check(`${w}x${h} summary fits with nothing escaping`, !fit.scrolls && !fit.page && fit.escapes.length === 0,
    fit.escapes.join(' / '));
  if (w <= 1180) check(`${w}x${h} fallback layout still scrolls rather than clips`,
    await p.evaluate(() => getComputedStyle(document.querySelector('.stage')).overflowY === 'auto'));
  await p.close();
}

/* ══════════════════════════════════════════════════════════════════════════
   2. DECK
   ══════════════════════════════════════════════════════════════════════════ */
console.log('\nDECK');
{
  const p = await open(DECK, { width: 1920, height: 1080 });

  const meta = await p.evaluate(() => ({
    fonts: [...new Set([...document.fonts].map(f => f.family))],
    loaded: document.fonts.status === 'loaded'
      && document.fonts.check('300 16px Poppins') && document.fonts.check('700 16px Poppins'),
    total: document.getElementById('p-total').textContent,
    transform: document.getElementById('canvas').style.transform,
    strip: document.querySelector('.presenter').textContent.replace(/\s+/g, ' ').trim(),
    masked: document.querySelectorAll('.masked').length,
    words: document.querySelectorAll('.w').length
  }));
  check('Poppins is the only typeface', meta.fonts.length === 1 && meta.fonts[0] === 'Poppins', meta.fonts.join(','));
  check('Poppins actually loaded, so line breaks are the designed ones', meta.loaded);
  check('25 slides', meta.total === '25', meta.total);
  check('canvas scales exactly 1.5x at 1920', meta.transform.includes('scale(1.5)'), meta.transform);
  check('presenter strip carries no key hints', !/notes|full screen/i.test(meta.strip), meta.strip);
  check('mask reveals are wired', meta.masked > 100, String(meta.masked));
  check('kinetic word splits are wired', meta.words > 20, String(meta.words));

  await press(p, 'h', 400);
  const helpOn = await p.evaluate(() => document.getElementById('help').classList.contains('on'));
  await press(p, 'Escape', 300);
  const helpOff = await p.evaluate(() => !document.getElementById('help').classList.contains('on'));
  check('H opens the controls panel, Esc closes it', helpOn && helpOff);
  await p.close();
}

/* every slide fits the canvas, and the rail lights in order */
console.log('\nDECK · every slide fits 1280x720');
{
  const p = await open(DECK, { width: 1280, height: 720 });
  const probe = () => p.evaluate(() => {
    const el = document.querySelector('.slide.is-active');
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const bottom = r.bottom - parseFloat(cs.paddingBottom);
    const stripTop = document.querySelector('.presenter').getBoundingClientRect().top;
    let over = 0, who = '', tiny = Infinity;
    el.querySelectorAll('*').forEach(n => {
      const q = n.getBoundingClientRect();
      const txt = (n.textContent || '').trim();
      if (!q.height || !txt) return;
      /* A masked element's box is padding-bottom taller than its ink, and a
         matching negative margin cancels it in flow. Measure the ink. */
      const pad = n.classList.contains('masked') ? parseFloat(getComputedStyle(n).paddingBottom) || 0 : 0;
      const ink = q.bottom - pad;
      if (ink - bottom > over) { over = ink - bottom; who = txt.slice(0, 24); }
      if (!n.children.length) {
        const fs = parseFloat(getComputedStyle(n).fontSize);
        if (fs) tiny = Math.min(tiny, fs);
      }
    });
    return {
      slide: document.getElementById('p-n').textContent,
      over: Math.round(over), who, tiny,
      clearance: Math.round(stripTop - bottom),
      rail: document.getElementById('rail').classList.contains('on')
        ? [...document.querySelectorAll('.rail__seg')].map(s =>
            s.classList.contains('is-now') ? 'N' : s.classList.contains('is-past') ? 'p' : '.').join('')
        : 'off',
      console: document.getElementById('console').classList.contains('on')
    };
  });

  const rails = {};
  let worstType = Infinity;
  for (let n = 0; n < 25; n++) {
    const id = await probe();
    if (id.console) { await press(p, 'Escape', 350); continue; }
    for (let g = 0; g < 14; g++) {                       // reveal the whole slide
      await press(p, 'ArrowRight', 170);
      const s = await probe();
      if (s.console) break;
      if (s.slide !== id.slide) { await press(p, 'ArrowLeft', 900); break; }
    }
    const fin = await probe();
    if (fin.console) { await press(p, 'Escape', 350); continue; }
    /* Half the gap between the content box and the presenter strip: text
       stays visibly clear of the strip, and a word of shaping difference
       between browser builds does not fail a slide that looks right. */
    const budget = Math.max(1, Math.floor(fin.clearance / 2));
    check(`slide ${fin.slide} fits`, fin.over <= budget,
      `+${fin.over}px over a ${budget}px budget "${fin.who}"`);
    if (fin.rail !== 'off') rails[fin.slide] = fin.rail;
    worstType = Math.min(worstType, fin.tiny);
    await press(p, 'ArrowRight', 220);
  }
  check('nothing below 18px inside the canvas', worstType >= 18, `${worstType}px`);
  check('the loop rail advances in order',
    rails['07'] === 'N....' && rails['08'] === 'pN...' && rails['09'] === 'ppN..' &&
    rails['10'] === 'pppN.' && rails['11'] === 'NNNNN', JSON.stringify(rails));
  check('deck makes no external request', p.external.length === 0, p.external.join(','));
  check('deck runs without errors', p.errors.length === 0, p.errors.join(' | '));
  await p.close();
}

/* ══════════════════════════════════════════════════════════════════════════
   3. THE HANDOFF — the seam between the two halves
   ══════════════════════════════════════════════════════════════════════════ */
console.log('\nHANDOFF');
{
  const p = await open(DECK, { width: 1920, height: 1080 });
  for (let g = 0; g < 200; g++) {
    const on = await p.evaluate(() => document.getElementById('console').classList.contains('on'));
    if (on) break;
    await press(p, 'ArrowRight', 130);
  }
  await p.waitForTimeout(800);

  const frame = p.frames().find(f => f.url().includes('broken-loop.html'));
  check('the dashboard loads inside the deck', !!frame);

  if (frame) {
    const deckGround = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const dashGround = await frame.evaluate(() => getComputedStyle(document.body).backgroundColor);
    check('the deck has already inverted to the dashboard\'s exact ground',
      deckGround === dashGround, `deck ${deckGround} vs dashboard ${dashGround}`);

    await frame.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    await p.waitForTimeout(500);
    const back = await p.evaluate(() => ({
      slide: document.getElementById('p-n').textContent,
      dark: document.body.classList.contains('is-dark'),
      gone: !document.getElementById('console').classList.contains('on')
    }));
    check('Esc returns to the deck on the dark ground', back.gone && back.dark, JSON.stringify(back));

    await press(p, 'ArrowRight', 900);
    const light = await p.evaluate(() => !document.body.classList.contains('is-dark'));
    check('the return slide inverts back to light on its first step', light);
  }
  check('handoff makes no external request', p.external.length === 0, p.external.join(','));
  await p.close();
}

/* ══════════════════════════════════════════════════════════════════════════
   4. THE ONE-FILE SESSION — the version that actually gets presented
   ══════════════════════════════════════════════════════════════════════════ */
console.log('\nONE FILE');
{
  const p = await open(SESSION, { width: 1920, height: 1080 });
  check('one file, 25 slides', await p.evaluate(() => document.getElementById('p-total').textContent) === '25');

  for (let g = 0; g < 220; g++) {
    if (await p.evaluate(() => document.getElementById('console').classList.contains('on'))) break;
    await press(p, 'ArrowRight', 110);
  }
  await p.waitForTimeout(900);

  const frame = p.frames().find(f => f !== p.mainFrame());
  check('the dashboard is carried inside the page', !!frame && frame.url().startsWith('about:srcdoc'),
    frame ? frame.url().slice(0, 40) : 'no frame');

  if (frame) {
    /* A srcdoc frame proves self-containment: nothing was fetched from a
       sibling file, so the one file is the whole session. */
    const header = await frame.evaluate(() => document.querySelector('.lockup__text').textContent.trim());
    check('the embedded dashboard is the real one', header.startsWith('Feedback Management Dashboard'), header);
    check('its fonts came with it', await frame.evaluate(() => document.fonts.check('300 16px Poppins')));

    const deckBg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const dashBg = await frame.evaluate(() => getComputedStyle(document.body).backgroundColor);
    check('the grounds still match exactly', deckBg === dashBg, `${deckBg} vs ${dashBg}`);

    await frame.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })));
    await p.waitForTimeout(220);
    await frame.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true })));
    await p.waitForTimeout(950);
    /* Options are shuffled and some cost zero minutes, so the minutes
       read-out is not a reliable signal that a decision landed. The screen is. */
    const view = await frame.evaluate(() => document.querySelector('.screen.is-active').id);
    check('decisions record inside the embedded dashboard', view === 'screen-conseq', view);

    await frame.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    await p.waitForTimeout(550);
    const back = await p.evaluate(() => ({
      dark: document.body.classList.contains('is-dark'),
      gone: !document.getElementById('console').classList.contains('on')
    }));
    check('Esc hands back to the deck', back.gone && back.dark, JSON.stringify(back));
  }
  check('one file makes no external request', p.external.length === 0, p.external.join(','));
  check('one file runs without errors', p.errors.length === 0, p.errors.join(' | '));
  await p.close();
}

/* reduced motion collapses everything to an instant state change */
console.log('\nREDUCED MOTION');
{
  const p = await open(DECK, { width: 1920, height: 1080 }, { reducedMotion: 'reduce' });
  await press(p, 'ArrowRight', 60);                      // far below the 780ms mask
  const settled = await p.evaluate(() => {
    const i = document.querySelector('.slide.is-active [data-step="1"] .w > i, .slide.is-active [data-step="1"] .rv');
    return i ? getComputedStyle(i).transform : null;
  });
  check('deck reveals land instantly', settled === 'none', String(settled));
  await p.close();

  const d = await open(DASH, { width: 1920, height: 1080 }, { reducedMotion: 'reduce' });
  await press(d, 'ArrowRight');
  await press(d, '1', 60);                               // far below the 900ms swing
  const needle = await d.evaluate(() =>
    document.querySelector('.gauge[data-g=standard] [data-role=val]').textContent);
  check('dashboard needles land instantly', needle !== '0', needle);
  await d.close();
}

await browser.close();

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFailures:');
  failures.forEach(f => console.log('  · ' + f));
  process.exit(1);
}
