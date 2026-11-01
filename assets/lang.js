// Language pick, run before first paint: ?lang=ar|en > saved choice (EN/AR button) > first browser language ("ar" prefix).
// Sets <html lang dir> so the RTL stylesheet applies at once; landing.js then swaps the strings. No geolocation, no third party.
(() => {
const L = ['en', 'ar'], q = new URLSearchParams(location.search).get('lang');
let lang = L.includes(q) ? q : null;
if (!lang) { try { const s = localStorage.getItem('hn_lang'); if (L.includes(s)) lang = s; } catch {} }
if (!lang) { const first = (navigator.languages && navigator.languages[0]) || navigator.language || ''; lang = /^ar(-|_|$)/i.test(first) ? 'ar' : 'en'; }   // first preferred language only: a secondary Arabic entry must not flip the page
const d = document.documentElement;
d.lang = lang; d.dir = lang === 'ar' ? 'rtl' : 'ltr';
if (lang === 'ar') {
// per-page Arabic title / description come from data-title-ar / data-desc-ar on the <script> tag (beta.html); the landing keeps the defaults
const me = document.currentScript, ds = (me && me.dataset) || {};
const title = ds.titleAr || 'High Noon — قريباً على App Store و Google Play';
const desc = ds.descAr || 'High Noon — مبارزات غربية 1 ضد 1. اسحب أسرع، عِش أطول. قريباً على iOS و Android.';
const set = (sel, v) => { const m = document.querySelector(sel); if (m) m.content = v; };
document.title = title;
set('meta[name="description"]', desc);
set('meta[property="og:title"]', title);
set('meta[property="og:description"]', desc.replace(/^High Noon — /, ''));
}
})();
