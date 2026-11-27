(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const px = (...a) => window.hnTrack && window.hnTrack(...a);   // Meta Pixel event, sent only after consent (consent.js)
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// i18n — <html lang dir> is set by lang.js before first paint; here we swap the strings (HTML stays English = fallback).
// Brand, store names, town signs and gun names stay in Latin. Arabic copy reviewed by: (pending native review).
const LANG = document.documentElement.lang === 'ar' ? 'ar' : 'en';
const AR = {
ribbon: '6 ديسمبر', hero_tag: '★ اسحب أسرع · عِش أطول ★', soon_on: 'يصدر 6 ديسمبر على',
hero_note: 'ستصلك برقية عند الظهيرة.<b>↓</b>', note_when: 'يصدر {when} بتوقيتك.<b>↓</b>',
cd_label: 'الإطلاق: 6 ديسمبر 2026، عند الظهيرة بتوقيت باريس', cd_k: 'الإطلاق بعد', cd_d: 'أيام', cd_h: 'ساعات', cd_m: 'دقائق', cd_s: 'ثوانٍ',
beta_tag: 'الإطلاق', beta_k: 'إطلاق اللعبة', beta_h: 'High Noon ينطلق في 6 ديسمبر.', beta_status: 'مفتوح للجميع',
beta_p: 'انتهت البيتا. شكراً لأول المختبرين الذين تبارزوا منذ 31 أكتوبر. في 6 ديسمبر، يُفتح High Noon للجميع على iPhone و Android، مجاناً.',
beta_cta: 'انضم إلى قائمة الإطلاق ←', beta_discord: 'انضم إلى المجتمع', beta_note: 'مجاناً على iOS و Android · <a href="beta.html">عن البيتا</a>',
duel_k: 'ما ينتظرك', duel_h: 'بارِز.<br>اكسب.<br>تسلّق.',
beat1_h: 'بارِز العالم كلّه.', beat1_p: 'مبارزات 1 ضد 1 مع خارجين عن القانون من كل مكان. اربح الذهب والغنائم وارتقِ في التصنيف.',
streak: 'أيام متتالية', beat2_h: 'مكافآت يومية.', beat2_p: 'تحديات جديدة كل يوم. فوّت يوماً واحداً وتخسر سلسلتك.',
exclusive: 'حصري', beat3_h: 'تذكرة المعركة.', beat3_p: 'سكنات وأسلحة لن تجدها في المتجر.',
arsenal_k: 'الترسانة', arsenal_h: 'اختر سلاحك.', arsenal_p: 'ثلاثة أسلحة عند الإطلاق. ثلاثة طلاءات. والمزيد في الطريق.',
steel: 'فولاذ', silver: 'فضة', gold: 'ذهب',
gun1_p: 'متوازن. موثوق. الكلاسيكي.', gun2_p: 'خفيف. سريع. لا يخطئ.', gun3_p: 'بطيء. صاخب. لا فرصة ثانية.',
tease_h: 'مجهول', tease_p: 'معلّق على الجدار. ليس للبيع. ليس بعد.', tease_fin: 'المزيد من الأسلحة قادم',
ranked_k: 'التصنيف · المواسم', ranked_h: 'تسلّق السلّم.', ranked_p: 'كل مبارزة تحرّك مكافأتك. وكل موسم يتوّج أساطير جديدة.',
season: 'الموسم الرابع', top_guns: 'أفضل المسلّحين', gunslinger: 'المبارز', reward: 'المكافأة', you: 'أنت',
board_foot: 'اربح تأخذ نقاط مكافأة. اخسر تُعِد بعضها. المواسم تُصفّر اللوحة، لا أسطورتك.',
rookie: 'مبتدئ', vagabond: 'متشرّد', outlaw: 'طريد', marshal: 'مارشال', legend: 'أسطورة',
wanted: '★ مطلوب ★', you_h: 'أنت.', poster_p: '6 ديسمبر، عند الظهيرة. كن في الشارع. برقية واحدة. بلا إزعاج.',
notify_me: 'أبلغني', email_aria: 'البريد الإلكتروني', fine: '6 ديسمبر · App Store و Google Play',
done: 'وصلت البرقية.<br>نراك عند الظهيرة.', done_confirm: 'أُرسلت البرقية.<br>أكّدها من بريدك.',
err_generic: 'حدث خطأ ما. حاول مجدداً.', err_network: 'تعذّر الوصول إلى التلغراف. حاول مجدداً.',
discord: 'أو انضم إلى الفرقة على Discord ←',
draw_k: 'أثبت ذلك', draw_h: 'ما مدى سرعة سحبك؟', draw_p: 'اضغط عندما يرنّ الجرس. ليس قبله.',
round_one: 'الجولة الأولى', ready: 'مستعد؟', tap_saddle: 'اضغط للاستعداد', saddle_up: 'استعد', your_best: 'أفضل وقت لك', arena_aria: 'اختبار سرعة رد الفعل',
hold: 'انتظر…', wait_bell: 'انتظر الجرس', draw_now: 'اسحب!', too_early: 'مبكّر جداً', bang: 'طاخ.', early_sub: 'سحبت قبل الجرس. اضغط للمحاولة مجدداً',
round_n: 'الجولة {n} — اضغط للسحب مجدداً', no_draws: 'لا سحبات بعد. استعد.',
r_legend: 'أسطورة', r_gunslinger: 'مبارز', r_deputy: 'نائب الشريف', r_greenhorn: 'مبتدئ', r_tumbleweed: 'سلحفاة',
privacy: 'سياسة الخصوصية', cookies: 'إعدادات ملفات الارتباط', legal: 'الإشعار القانوني',
copy: '<span dir="ltr">© 2026 LEMON TREE.</span> علامتا App Store و Google Play التجاريتان مملوكتان لأصحابهما.',
launching: 'يصدر 6 ديسمبر',
// launch day (the countdown reached zero)
ribbon_live: 'متوفر الآن', get_on: 'حمّله من', today_on: 'يصدر اليوم على', note_live: 'إنها الظهيرة. اسحب.', note_rolling: 'إنها الظهيرة. التطبيقات في طريقها إلى المتاجر.', note_ios: 'متوفر الآن على App Store. Google Play في الطريق.', note_android: 'متوفر الآن على Google Play. App Store في الطريق.',
poster_live: 'High Noon متوفر الآن. نراك في الشارع.', poster_rolling: 'التطبيقات في طريقها إلى المتاجر. برقية واحدة عند وصولها.',
fine_live: 'مجاناً على App Store و Google Play', fine_rolling: 'يصدر اليوم · App Store و Google Play', launching_live: 'متوفر الآن', download: 'حمّل', today_k: 'يصدر اليوم',
title_live: 'High Noon — متوفر الآن على App Store و Google Play'
};
const tr = (k, en) => (LANG === 'ar' && AR[k] != null) ? AR[k] : en;
if (LANG === 'ar') {
$$('[data-i18n]').forEach(el => { const s = AR[el.dataset.i18n]; if (s == null) return; /<[a-z]/i.test(s) ? el.innerHTML = s : el.textContent = s; });
$$('[data-i18n-aria]').forEach(el => { const s = AR[el.dataset.i18nAria]; if (s) el.setAttribute('aria-label', s); });
}
// EN / AR button: shows the other language, remembers the choice, reloads on the explicit ?lang= URL
const langBtn = $('#lang');
if (langBtn) {
const next = LANG === 'ar' ? 'en' : 'ar';
langBtn.textContent = next === 'ar' ? 'عربي' : 'EN';
langBtn.lang = next; langBtn.setAttribute('aria-label', next === 'ar' ? 'العربية' : 'English');
langBtn.addEventListener('click', () => { try { localStorage.setItem('hn_lang', next); } catch {} const q = new URLSearchParams(location.search); q.set('lang', next); location.href = location.pathname + '?' + q.toString(); });
}

// anchors
$$('a[href^="#"]:not([data-consent-open])').forEach(a => a.addEventListener('click', e => {
const h = a.getAttribute('href'); if (!h || h[0] !== '#' || h.length < 2) return;   // re-read at click time: launch day swaps some hrefs to store links
const t = $(h); if (!t) return; e.preventDefault();
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
const measure = () => {
baseW = innerWidth; baseH = document.documentElement.clientHeight;
hero.style.setProperty('--svh', baseH + 'px');   // freeze the viewport height: in-app browsers resize the viewport while scrolling
};
const fitContent = () => {
hero.classList.toggle('compact', baseH < 720);
hero.classList.toggle('tiny', baseH < 600);
// the stores must clear the sticky bar: if the hero content still overflows the screen, step down a size (offsetHeight ignores the entrance transforms)
posse.style.minHeight = '';
const over = () => hero.offsetHeight - baseH;
const trim = floor => { const o = over(); if (o > 0.5) posse.style.minHeight = Math.max(floor, posse.offsetHeight - o) + 'px'; };   // less scenery height, never under the floor
if (over() > 0.5) hero.classList.add('compact');
trim(130);
if (over() > 0.5) hero.classList.add('tiny');
trim(90);
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
const refit = () => { measure(); fitContent(); layout(); };
const refitContent = () => { fitContent(); layout(); };   // fonts in, launch switch: same viewport, new content height
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { if (innerWidth !== baseW) refit(); });
addEventListener('orientationchange', () => setTimeout(refit, 350));
measure(); fitContent();
if ('ResizeObserver' in window) new ResizeObserver(layout).observe(hero); else layout();
addEventListener('load', () => { refitContent(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(refitContent); });   // the western fonts change the title height
if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', refitContent);
document.addEventListener('hn:live', refitContent);   // the countdown disappears at launch
}

// weapon finish tabs
const finishBtns = $$('.finish button'), guns = $$('.gun'), realGuns = guns.filter(g => g.dataset.gun);
const fin = { '': tr('steel', 'Steel'), '-silver': tr('silver', 'Silver'), '-gold': tr('gold', 'Gold') };
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
$('.badge', you).src = 'assets/star-diamond.png'; you.classList.add('up');   // 1,978 + 24 = 2,002 -> Legend (>= 2,000)
setTimeout(() => $$('.tier').forEach(t => t.classList.toggle('here', t.dataset.tier === 'legend')), 700);
}, 2300);
}, { threshold: .5 }).observe(board);
}

// notify form -> Mailchimp (JSONP endpoint of the audience signup form)
const form = $('.form');
if (form) {
const inp = $('input[type=email]', form), hp = $('.hp input', form), done = $('.done'), fine = $('.fine'), btn = $('button', form);
const endpoint = form.dataset.endpoint;
const finish = msg => { px('Lead'); form.hidden = true; fine.hidden = true; done.hidden = false; if (/confirm/i.test(msg)) done.innerHTML = tr('done_confirm', 'Telegram sent.<br>Confirm it in your inbox.'); };
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
else fail((r && r.msg) || tr('err_generic', 'Something went wrong. Try again.'));
} catch (err) { fail(tr('err_network', 'Could not reach the telegraph. Try again.')); }
});
}

// launch countdown -> at zero the page switches itself to "out now" (no redeploy needed)
const LAUNCH = Date.parse('2026-12-06T11:00:00Z');   // Sunday December 6, 2026, 12:00 Paris time (CET = UTC+1)
const STORE_URL = { ios: 'https://apps.apple.com/app/id6811609069', android: '' };   // empty = link not known yet: that button keeps pointing at the launch list
// testing only, on a local server: ?now=2026-12-06T11:00:00Z previews the page at that moment (display only, nothing is stored or sent)
const nowQ = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? new URLSearchParams(location.search).get('now') : null;
let skew = nowQ && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/.test(nowQ) && Number.isFinite(Date.parse(nowQ)) ? Date.parse(nowQ) - Date.now() : 0;
const now = () => Date.now() + skew;
// a visitor's clock can be wrong: align on the server's Date header (same origin, allowed by connect-src 'self') when it is off by more than 30 s
let clockChecked = !!nowQ || !window.fetch;
const clockDone = () => { if (!clockChecked) { clockChecked = true; restart(); } };
if (!clockChecked) {
fetch(location.pathname, { method: 'HEAD', cache: 'no-store' }).then(r => { const d = Date.parse(r.headers.get('Date')); if (Number.isFinite(d) && Math.abs(d - Date.now()) > 30000) skew = d - Date.now(); }).catch(() => {}).then(clockDone);
setTimeout(clockDone, 3000);   // never wait more than 3 s for the server
}
const pad = n => String(n).padStart(2, '0');
const parts = ms => { const t = Math.max(0, Math.ceil(ms / 1000)); return { d: Math.floor(t / 86400), h: Math.floor(t % 86400 / 3600), m: Math.floor(t % 3600 / 60), s: t % 60 }; };
const shortLeft = p => LANG === 'ar'
? (p.d ? `${p.d} يوم و${p.h} ساعة` : `${p.h} ساعة و${p.m} دقيقة`)
: (p.d ? `${p.d}d ${pad(p.h)}h ${pad(p.m)}m` : `${pad(p.h)}h ${pad(p.m)}m ${pad(p.s)}s`);
// the launch moment in the visitor's own time zone, under the store buttons
const noteEl = $('#heroNote');
try {
const when = new Intl.DateTimeFormat(LANG === 'ar' ? 'ar-u-nu-latn' : 'en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(LAUNCH);
if (noteEl && Date.now() < LAUNCH) noteEl.innerHTML = tr('note_when', 'Out {when}, your time.<b>↓</b>').replace('{when}', when.replace(/[<>&]/g, ''));
} catch {}
const setT = (el, k, en) => { if (!el) return; const s = tr(k, en); /<[a-z]/i.test(s) ? el.innerHTML = s : el.textContent = s; };
const ext = (a, url) => { a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; };
const cd = $('#countdown'), cdNums = cd ? $$('[data-u]', cd) : [], stickyS = $('#stickyS');
if (stickyS) stickyS.lang = LANG;
const goLive = () => {
const both = !!(STORE_URL.ios && STORE_URL.android);
document.body.classList.add('live');
document.title = tr('title_live', 'High Noon — Out now on App Store & Google Play');
setT($('#ribbon'), 'ribbon_live', 'Out now');
if (cd) cd.hidden = true;
$$('.store').forEach(a => { const url = STORE_URL[a.dataset.store]; setT($('.store-k', a), url ? 'get_on' : 'today_on', url ? 'Get it on' : 'Out today on'); if (url) ext(a, url); });
const noteK = both ? ['note_live', "It's high noon. Draw."] : STORE_URL.ios ? ['note_ios', 'Out now on the App Store. Google Play is on its way.'] : STORE_URL.android ? ['note_android', 'Out now on Google Play. The App Store is on its way.'] : ['note_rolling', "It's high noon. The apps are rolling out."];
setT(noteEl, noteK[0], noteK[1]);
const beta = $('#beta'); if (beta) beta.hidden = true;
setT($('#posterP'), both ? 'poster_live' : 'poster_rolling', both ? 'High Noon is out. See you in the street.' : 'The apps are rolling out to the stores. One telegram when they land.');
const fineEl = $('.notify .fine'), doneEl = $('.notify .done');
if (both) {
if (form) form.hidden = true; if (doneEl) doneEl.hidden = true; setT(fineEl, 'fine_live', 'Free on App Store & Google Play'); if (fineEl) fineEl.hidden = false;
const heroStores = $('.hero .stores'), poster = $('.notify .poster');
if (heroStores && poster && !$('.stores', poster)) { const c = heroStores.cloneNode(true); c.classList.add('poster-stores'); poster.insertBefore(c, fineEl || null); }
}
else if (fineEl && !fineEl.hidden) setT(fineEl, 'fine_rolling', 'Out today · App Store & Google Play');
const btn = $('#stickyBtn');
const ua = navigator.userAgent, isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1), isAndroid = /Android/.test(ua);
const mine = isIOS ? STORE_URL.ios : isAndroid ? STORE_URL.android : '';
if (mine || (both && !isIOS && !isAndroid)) {   // a link for this visitor (or a desktop visitor once both stores are live): "Out now · Download"
setT($('#stickyK'), 'launching_live', 'Out now');
if (stickyS) { stickyS.lang = 'en'; stickyS.textContent = both ? 'iOS · Android' : isIOS ? 'App Store' : 'Google Play'; }
if (btn) { if (mine) ext(btn, mine); else btn.href = '#top'; setT(btn, 'download', 'Download'); }
} else {   // this visitor's store is not live yet: keep the launch list
setT($('#stickyK'), 'today_k', 'Out today');
if (stickyS) { stickyS.lang = 'en'; stickyS.textContent = 'App Store · Google Play'; }
}
};
let timer = 0, isLive = false;
const tick = () => {
clearTimeout(timer);
if (isLive) return;
const left = LAUNCH - now();
if (left <= 0) { if (!clockChecked) return; isLive = true; goLive(); document.dispatchEvent(new Event('hn:live')); return; }   // a fast visitor clock must not open the doors early
const p = parts(left);
cdNums.forEach(b => { const v = pad(p[b.dataset.u]); if (b.textContent === v) return; b.textContent = v; const u = b.parentNode; u.classList.remove('flip'); void u.offsetWidth; u.classList.add('flip'); });   // restart the flip animation
if (stickyS) stickyS.textContent = shortLeft(p);
timer = setTimeout(tick, (left % 1000) + 20);
};
const restart = () => tick();
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });   // background tabs throttle timers: resync on return
tick();

// draw game
const arena = $('#arena');
if (arena) {
const ui = { k: $('.arena-k', arena), big: $('.arena-big', arena), sub: $('.arena-sub', arena) };
const KEY = 'hn_draw_times';
let st = 'idle', timer = 0, t0 = 0, round = 1;
const set = (s, k, big, sub) => { st = s; arena.dataset.state = s; ui.k.textContent = k; ui.big.textContent = big; ui.sub.textContent = sub; };
const rate = ms => ms < 180 ? tr('r_legend', 'Legend') : ms < 220 ? tr('r_gunslinger', 'Gunslinger') : ms < 280 ? tr('r_deputy', 'Deputy') : ms < 350 ? tr('r_greenhorn', 'Greenhorn') : tr('r_tumbleweed', 'Tumbleweed');
const load = () => { try { return (JSON.parse(localStorage.getItem(KEY)) || []).filter(Number.isFinite); } catch { return []; } };
const render = () => {
const t = load().sort((a, b) => a - b).slice(0, 5);
$('#best').textContent = t.length ? t[0] + ' ms' : '—';
$('#scoreList').innerHTML = t.length ? t.map((ms, i) => `<li><span class="rk">${i + 1}</span><b>${ms} ms</b><span class="lbl">${rate(ms)}</span></li>`).join('') : `<li class="empty">${tr('no_draws', 'No draws yet. Saddle up.')}</li>`;
};
const arm = () => { set('wait', tr('hold', 'Hold…'), '· · ·', tr('wait_bell', 'Wait for the bell')); timer = setTimeout(() => { set('go', '', tr('draw_now', 'DRAW!'), ''); t0 = performance.now(); }, 1400 + Math.random() * 2600); };
const act = () => {
if (st === 'idle' || st === 'hit' || st === 'early') return arm();
if (st === 'wait') { clearTimeout(timer); set('early', tr('too_early', 'Too early'), tr('bang', 'BANG.'), tr('early_sub', 'You drew before the bell. Tap to retry')); return; }
if (st === 'go') {
const ms = Math.round(performance.now() - t0);
if (round === 1) px('QuickDrawPlayed', { ms }, true);
set('hit', rate(ms), ms + ' ms', tr('round_n', 'Round {n} — tap to draw again').replace('{n}', ++round));
const t = load(); t.push(ms); localStorage.setItem(KEY, JSON.stringify(t.sort((a, b) => a - b).slice(0, 10))); render();
}
};
arena.addEventListener('pointerdown', e => { e.preventDefault(); act(); });
addEventListener('keydown', e => { if (e.code !== 'Space' || e.repeat) return; const r = arena.getBoundingClientRect(); if (r.top < innerHeight * .8 && r.bottom > innerHeight * .2) { e.preventDefault(); act(); } });
render();
}

// outbound / intent clicks
$$('a[href*="discord.gg"]').forEach(a => a.addEventListener('click', () => px('DiscordClick', {}, true)));
document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('.store'); if (a) px('StoreButtonClick', { store: $('.store-n', a).textContent }, true); });
const llc = $('#launchListCta'); if (llc) llc.addEventListener('click', () => px('LaunchListClick', {}, true));

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
