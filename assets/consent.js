// consent banner + Meta Pixel — the pixel is only loaded after the visitor accepts (CNIL / GDPR)
(() => {
const me = document.currentScript, PIXEL = (me && me.dataset.pixel || '').trim();
const KEY = 'hn_consent', VER = 1, DAY = 864e5;
const TTL = { yes: 395 * DAY, no: 182 * DAY };   // consent kept 13 months, refusal 6 months, then ask again

const read = () => {
try {
const c = JSON.parse(localStorage.getItem(KEY));
if (!c || c.v !== VER || Date.now() - c.t > TTL[c.ads ? 'yes' : 'no']) return null;
return c;
} catch { return null; }
};
const save = ads => { try { localStorage.setItem(KEY, JSON.stringify({ v: VER, ads, t: Date.now() })); } catch {} };

let on = false;
const load = () => {
if (on || !PIXEL) return; on = true;
const n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
if (!window._fbq) window._fbq = n;
n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
const s = document.createElement('script'); s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js';
document.head.appendChild(s);
fbq('set', 'autoConfig', false, PIXEL);   // no automatic button / form scraping: we only send the events below
fbq('init', PIXEL);
fbq('track', 'PageView');
};

// public helper for landing.js — a no-op until the visitor has accepted
window.hnTrack = (name, params, custom) => { if (on) fbq(custom ? 'trackCustom' : 'track', name, params || {}); };

const banner = () => {
let el = document.getElementById('consent');
if (el) { el.hidden = false; return; }
el = document.createElement('div');
el.id = 'consent'; el.className = 'consent'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Cookie consent');
el.innerHTML = `<div class="consent-in">
<p lang="en">We'd like to use cookies (Meta Pixel) to measure our ads and show High Noon to people who visited this page. The site works the same if you decline. <a href="https://high-noon-reborn.web.app/privacy.html" target="_blank" rel="noopener noreferrer">Privacy policy</a></p>
<p lang="ar" dir="rtl">نودّ استخدام ملفات تعريف الارتباط (Meta Pixel) لقياس أداء إعلاناتنا وعرض High Noon لمن زار هذه الصفحة. يعمل الموقع بالطريقة نفسها إذا رفضت.</p>
<div class="consent-btns"><button type="button" class="btn btn-wood" data-ads="0">Decline · رفض</button><button type="button" class="btn btn-wood" data-ads="1">Accept · قبول</button></div>
</div>`;
el.addEventListener('click', e => {
const b = e.target.closest('button[data-ads]'); if (!b) return;
const ads = b.dataset.ads === '1', was = on;
save(ads); el.hidden = true;
if (ads) load(); else if (was) location.reload();   // withdrawing consent: reload so the pixel is gone
});
document.body.appendChild(el);
};

const start = () => {
if (!PIXEL) return;   // no dataset id yet: nothing to consent to
const c = read();
if (c && c.ads) load(); else if (!c) banner();
document.querySelectorAll('[data-consent-open]').forEach(a => { a.hidden = false; a.addEventListener('click', e => { e.preventDefault(); banner(); }); });
};
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
