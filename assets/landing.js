(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const px = (...a) => window.hnTrack && window.hnTrack(...a);   // Meta Pixel event, sent only after consent (consent.js)
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// anchors
$$('a[href^="#"]:not([data-consent-open])').forEach(a => a.addEventListener('click', e => {
const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault();
window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 8, behavior: RM ? 'auto' : 'smooth' });
}));

// scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach(el => io.observe(el));

// count-up
function countTo(el, to, dur = 1400, fmt = v => Math.round(v)) {
const from = +el.dataset.from || 0, t0 = performance.now();
const step = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(from + (to - from) * e); if (p < 1) requestAnimationFrame(step); };
requestAnimationFrame(step);
}
const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; cio.unobserve(e.target); const el = e.target; setTimeout(() => countTo(el, +el.dataset.count, 1300, v => (el.dataset.prefix || '') + Math.round(v)), 500); }), { threshold: .6 });
$$('[data-count]:not(.elo)').forEach(el => cio.observe(el));

// hero sunset: scroll progress drives the sun (noon -> behind the town) and the sky colour
const wrap = $('.hero-wrap'), hero = $('.hero'), posse = $('.posse'), sun = $('.sun'), mark = $('.wordmark');
if (wrap && hero && posse && sun) {
let range = 1, ticking = false, baseW = 0, baseH = 0;
// Viewport is measured once per orientation (never on the resize events fired when the mobile
// address bar collapses during scroll), so the hero layout and the sun's course stay frozen.
const fit = () => {
baseW = innerWidth; baseH = document.documentElement.clientHeight;
hero.style.setProperty('--svh', baseH + 'px');   // freeze the viewport height: in-app browsers resize the viewport while scrolling
hero.classList.toggle('compact', baseH < 720);
hero.classList.toggle('tiny', baseH < 600);
};
const layout = () => {
const extra = Math.round(baseH * .55);               // scroll distance over which the sunset plays
wrap.style.height = (hero.offsetHeight + extra) + 'px';
range = extra;
// noon: sun centred on the wordmark at the very top; sunset: sunk behind the town, just above the ground line
const pr = posse.getBoundingClientRect(), wr = (mark || hero).getBoundingClientRect();
const startCenter = Math.round(wr.top - pr.top + wr.height / 2);
const endCenter = Math.round(posse.offsetHeight * .86);
hero.style.setProperty('--sun-start', (startCenter - sun.offsetHeight / 2) + 'px');
hero.style.setProperty('--sun-travel', (endCenter - startCenter) + 'px');
update();
};
const update = () => {
ticking = false;
const p = clamp(scrollY / range, 0, 1);
hero.style.setProperty('--p', p.toFixed(4));
};
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
const refit = () => { fit(); layout(); };
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { if (innerWidth !== baseW) refit(); });
addEventListener('orientationchange', () => setTimeout(refit, 350));
fit();
if ('ResizeObserver' in window) new ResizeObserver(layout).observe(hero); else layout();
addEventListener('load', layout);
}

// weapon finish tabs
const finishBtns = $$('.finish button'), guns = $$('.gun'), realGuns = guns.filter(g => g.dataset.gun);
const fin = { '': 'Steel', '-silver': 'Silver', '-gold': 'Gold' };
Object.keys(fin).forEach(f => realGuns.forEach(g => { const i = new Image(); i.src = `assets/weapons/${g.dataset.gun}${f}.webp`; }));
finishBtns.forEach(b => b.addEventListener('click', () => {
finishBtns.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
const f = b.dataset.finish;
realGuns.forEach(g => {
g.dataset.finish = f; g.classList.remove('swap'); void g.offsetWidth;
$('img', g).src = `assets/weapons/${g.dataset.gun}${f}.webp`; $('.fin', g).textContent = fin[f]; g.classList.add('swap');
});
}));

// carousel: dots + mouse drag with inertia + snap
const track = $('.guns'), dots = $$('.guns-hint i');
if (track && dots.length) {
const centerOf = g => g.offsetLeft - (track.clientWidth - g.offsetWidth) / 2;
const goTo = (j, smooth = true) => track.scrollTo({ left: centerOf(guns[clamp(j, 0, guns.length - 1)]), behavior: smooth && !RM ? 'smooth' : 'auto' });
const nearest = x => guns.reduce((b, g, j) => Math.abs(centerOf(g) - x) < Math.abs(centerOf(guns[b]) - x) ? j : b, 0);
let cur = 0, pend = false;
const sync = () => { pend = false; const i = nearest(track.scrollLeft); if (i === cur) return; cur = i; dots.forEach((d, j) => d.classList.toggle('on', j === i)); guns.forEach((g, j) => g.classList.toggle('off', j !== i)); };
track.addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(sync); } }, { passive: true });   // one update per frame, only when the active card changes
guns.forEach((g, j) => g.classList.toggle('off', j !== 0));
dots.forEach((d, j) => d.addEventListener('click', () => goTo(j)));
let drag = null;
track.addEventListener('pointerdown', e => {
if (e.pointerType !== 'mouse') return;
drag = { x: e.clientX, sl: track.scrollLeft, v: 0, last: e.clientX, t: performance.now(), moved: false };
track.classList.add('grab'); track.setPointerCapture(e.pointerId);
});
track.addEventListener('pointermove', e => {
if (!drag) return;
const now = performance.now(), dt = Math.max(1, now - drag.t);
drag.v = drag.v * .6 + ((e.clientX - drag.last) / dt) * .4; drag.last = e.clientX; drag.t = now;
const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) drag.moved = true;
track.scrollLeft = drag.sl - dx;
});
const end = () => {
if (!drag) return;
const projected = track.scrollLeft - drag.v * 180;
const j = nearest(projected);
drag = null; track.classList.remove('grab');
requestAnimationFrame(() => goTo(j));
};
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => track.addEventListener(ev, end));
track.addEventListener('dragstart', e => e.preventDefault());
}

// leaderboard sequence
const board = $('.board');
if (board) {
const rows = $$('.row', board), you = $('.row.you', board);
const setRanks = () => rows.forEach(r => { r.style.setProperty('--r', r.dataset.rank); $('.rk', r).textContent = r.dataset.rank; });
setRanks();
const fmt = v => Math.round(v).toLocaleString('en-US');
new IntersectionObserver(([e], o) => {
if (!e.isIntersecting) return; o.disconnect();
rows.forEach(r => countTo($('.elo', r), +r.dataset.elo, 1500, fmt));
setTimeout(() => {
rows.forEach(r => { const k = +r.dataset.rank; if (r === you) r.dataset.rank = 2; else if (k >= 2 && k < 5) r.dataset.rank = k + 1; });
setRanks();
const elo = $('.elo', you); elo.dataset.from = you.dataset.elo; countTo(elo, +you.dataset.elo + 24, 900, fmt);
$('img', you).src = 'assets/star-platinum.png'; you.classList.add('up');
setTimeout(() => $$('.tier').forEach(t => t.classList.toggle('here', t.dataset.tier === 'platinum')), 700);
}, 2300);
}, { threshold: .5 }).observe(board);
}

// notify form -> Mailchimp (JSONP endpoint of the audience signup form)
const form = $('.form');
if (form) {
const inp = $('input[type=email]', form), hp = $('.hp input', form), done = $('.done'), fine = $('.fine'), btn = $('button', form);
const endpoint = form.dataset.endpoint;
const finish = msg => { px('Lead'); form.hidden = true; fine.hidden = true; done.hidden = false; if (/confirm/i.test(msg)) done.innerHTML = 'Telegram sent.<br>Confirm it in your inbox.'; };
const fail = msg => { btn.disabled = false; form.classList.add('err'); setTimeout(() => form.classList.remove('err'), 500); if (msg) { fine.textContent = msg.replace(/<[^>]*>/g, '').replace(/^\d+ - /, ''); } };
const subscribe = email => new Promise((resolve, reject) => {
const cb = 'hnmc' + Date.now();
const s = document.createElement('script');
const t = setTimeout(() => { cleanup(); reject(new Error('timeout')); }, 12000);
const cleanup = () => { clearTimeout(t); delete window[cb]; s.remove(); };
window[cb] = data => { cleanup(); resolve(data); };
s.onerror = () => { cleanup(); reject(new Error('network')); };
const p = new URLSearchParams({ EMAIL: email, c: cb });
if (hp) p.set(hp.name, hp.value);
s.src = endpoint + '&' + p.toString();
document.head.appendChild(s);
});
form.addEventListener('submit', async e => {
e.preventDefault();
const email = inp.value.trim();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fail(); inp.focus(); return; }
if (!endpoint) { location.href = 'mailto:contact@high-noon.co?subject=' + encodeURIComponent('Notify me when High Noon launches') + '&body=' + encodeURIComponent('Please add ' + email + ' to the launch list.'); return; }
btn.disabled = true;
try {
const r = await subscribe(email);
if (r && r.result === 'success') finish(r.msg || '');
else if (r && /already/i.test(r.msg || '')) finish('');
else fail((r && r.msg) || 'Something went wrong. Try again.');
} catch (err) { fail('Could not reach the telegraph. Try again.'); }
});
}

// draw game
const arena = $('#arena');
if (arena) {
const ui = { k: $('.arena-k', arena), big: $('.arena-big', arena), sub: $('.arena-sub', arena) };
const KEY = 'hn_draw_times';
let st = 'idle', timer = 0, t0 = 0, round = 1;
const set = (s, k, big, sub) => { st = s; arena.dataset.state = s; ui.k.textContent = k; ui.big.textContent = big; ui.sub.textContent = sub; };
const rate = ms => ms < 180 ? 'Legend' : ms < 220 ? 'Gunslinger' : ms < 280 ? 'Deputy' : ms < 350 ? 'Greenhorn' : 'Tumbleweed';
const load = () => { try { return (JSON.parse(localStorage.getItem(KEY)) || []).filter(Number.isFinite); } catch { return []; } };
const render = () => {
const t = load().sort((a, b) => a - b).slice(0, 5);
$('#best').textContent = t.length ? t[0] + ' ms' : '—';
$('#scoreList').innerHTML = t.length ? t.map((ms, i) => `<li><span class="rk">${i + 1}</span><b>${ms} ms</b><span class="lbl">${rate(ms)}</span></li>`).join('') : '<li class="empty">No draws yet. Saddle up.</li>';
};
const arm = () => { set('wait', 'Hold…', '· · ·', 'Wait for the bell'); timer = setTimeout(() => { set('go', '', 'DRAW!', ''); t0 = performance.now(); }, 1400 + Math.random() * 2600); };
const act = () => {
if (st === 'idle' || st === 'hit' || st === 'early') return arm();
if (st === 'wait') { clearTimeout(timer); set('early', 'Too early', 'BANG.', 'You drew before the bell. Tap to retry'); return; }
if (st === 'go') {
const ms = Math.round(performance.now() - t0);
if (round === 1) px('QuickDrawPlayed', { ms }, true);
set('hit', rate(ms), ms + ' ms', `Round ${++round} — tap to draw again`);
const t = load(); t.push(ms); localStorage.setItem(KEY, JSON.stringify(t.sort((a, b) => a - b).slice(0, 10))); render();
}
};
arena.addEventListener('pointerdown', e => { e.preventDefault(); act(); });
addEventListener('keydown', e => { if (e.code !== 'Space' || e.repeat) return; const r = arena.getBoundingClientRect(); if (r.top < innerHeight * .8 && r.bottom > innerHeight * .2) { e.preventDefault(); act(); } });
render();
}

// outbound / intent clicks
$$('a[href*="discord.gg"]').forEach(a => a.addEventListener('click', () => px('DiscordClick', {}, true)));
$$('.store').forEach(a => a.addEventListener('click', () => px('StoreButtonClick', { store: $('.store-n', a).textContent }, true)));

// sticky CTA — visible from the top, hidden only over the notify form & the draw game
const sticky = $('#sticky'), notify = $('#notify'), draw = $('#draw');
if (sticky) {
let hide = 0;
const upd = () => sticky.classList.toggle('show', !hide);
const hid = new Set();
const obs = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? hid.add(e.target) : hid.delete(e.target)); hide = hid.size; upd(); }, { threshold: .15 });
[notify, draw].forEach(el => el && obs.observe(el));
setTimeout(upd, 1800);
}
})();
