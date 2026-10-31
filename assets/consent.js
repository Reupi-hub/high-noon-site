// Meta Pixel + "Cookie settings" panel — the pixel runs by default; a visitor can turn it off from the footer link
(() => {
const me = document.currentScript, PIXEL = (me && me.dataset.pixel || '').trim();
const KEY = 'hn_consent', VER = 1;

const read = () => { try { const c = JSON.parse(localStorage.getItem(KEY)); return c && c.v === VER ? c : null; } catch { return null; } };
const save = ads => { try { localStorage.setItem(KEY, JSON.stringify({ v: VER, ads, t: Date.now() })); } catch {} };
const optedOut = () => { const c = read(); return !!c && c.ads === false; };

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

// public helper for landing.js — a no-op when the pixel is off
window.hnTrack = (name, params, custom) => { if (on) fbq(custom ? 'trackCustom' : 'track', name, params || {}); };

// settings panel, opened only from the footer "Cookie settings" link
const panel = () => {
let el = document.getElementById('consent');
if (el) { el.hidden = false; return; }
el = document.createElement('div');
el.id = 'consent'; el.className = 'consent'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Cookie settings');
el.innerHTML = `<div class="consent-in">
<p lang="en">We use cookies (Meta Pixel) to measure our ads and show High Noon to people who visited this page. You can turn them off: the site works the same. <a href="https://high-noon-reborn.web.app/privacy.html" target="_blank" rel="noopener noreferrer">Privacy policy</a></p>
<p lang="ar" dir="rtl">نستخدم ملفات تعريف الارتباط (Meta Pixel) لقياس أداء إعلاناتنا وعرض High Noon لمن زار هذه الصفحة. يمكنك إيقافها، ويعمل الموقع بالطريقة نفسها.</p>
<div class="consent-btns"><button type="button" class="btn btn-wood" data-ads="0">Turn off<small lang="ar">إيقاف</small></button><button type="button" class="btn btn-wood" data-ads="1">Allow<small lang="ar">السماح</small></button></div>
</div>`;
el.addEventListener('click', e => {
const b = e.target.closest('button[data-ads]'); if (!b) return;
const ads = b.dataset.ads === '1', was = on;
save(ads); el.hidden = true;
if (ads) load(); else if (was) location.reload();   // turning it off: reload so the pixel is gone
});
document.body.appendChild(el);
};

const start = () => {
if (!PIXEL) return;   // no dataset id: nothing to run or to set
if (!optedOut()) load();
document.querySelectorAll('[data-consent-open]').forEach(a => { a.hidden = false; a.addEventListener('click', e => { e.preventDefault(); panel(); }); });
};
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
