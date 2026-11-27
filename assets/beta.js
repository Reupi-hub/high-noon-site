// beta.html — language swap (EN/AR), scroll reveal, "?thanks=1" block after a Stripe payment, click events for the pixel
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const px = (...a) => window.hnTrack && window.hnTrack(...a);   // Meta Pixel event, a no-op when the pixel is off (consent.js)
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

// i18n — <html lang dir> is set by lang.js before first paint; the HTML stays English (= fallback). Arabic copy: pending native review.
const LANG = document.documentElement.lang === 'ar' ? 'ar' : 'en';
const AR = {
bar_k: 'الإطلاق للجميع · 6 ديسمبر', bar_s: 'لا قائمة انتظار بعد الآن. احصل على برقية الإطلاق ←',
hero_k: 'برنامج البيتا · iOS و Android', hero_h: 'البيتا تنتهي في 6 ديسمبر.', status: 'وبعدها يدخل الجميع',
hero_p: 'نسخة التطبيق من High Noon بين أيدي أول دفعة من المختبرين على iPhone و Android منذ 31 أكتوبر 2026. في 6 ديسمبر، تُفتح للجميع.',
st_players: 'لاعب في الألفا', st_duels: 'مبارزة خاضوها', st_now: 'الإطلاق للجميع', hero_cta: 'احصل على برقية الإطلاق',
th_k: '★ ممتنّون لك ★', th_h: 'شكراً يا شريك.',
th_p: 'وصل دعمك للتو. يُبقي الخوادم تعمل والقهوة ساخنة. لا يشتري أي شيء داخل اللعبة — لكنه يعني الكثير للفريق.',
th_discord: 'انضم إلى الفرقة على Discord',
feat_k: 'ما ستلعبه', feat_h: 'اللعبة كاملة.', feat_p: 'ليس جزءاً منها. كل ما يلعبه المختبرون اليوم، متاح للجميع في 6 ديسمبر.',
f1_h: 'مبارزات 1 ضد 1 في الوقت الحقيقي', f1_p: 'اسحب، صوّب بهاتفك، أطلق، أعد التلقيم. ضد لاعبين من كل مكان — أو ضد بوت عندما يكون الشارع فارغاً.',
f2_h: 'ثلاثة أسلحة، ثلاثة طلاءات', f2_p: '<span lang="en">Schofield, Navy, Shotgun</span> — بالفولاذ والفضة والذهب.',
f3_h: 'مواسم مصنّفة', f3_p: 'كل مبارزة تحرّك مكافأتك. خمس درجات، من مبتدئ إلى أسطورة. أفضل المسلّحين في كل موسم يربحون سكنات حصرية.',
f4_h: 'مكافآت يومية', f4_p: 'تحدٍّ جديد كل يوم. حافظ على سلسلتك لمكافآت أكبر.',
f5_h: 'سكنات، عناصر، تذكرة المعركة', f5_p: 'سكنات الخارجين عن القانون، جرعات، ديناميت، إكسيرات. سكنات نسخة المتصفح موجودة أصلاً في خزانتك.',
f6_h: 'الأصدقاء والتحدّيات', f6_p: 'أضف أصدقاءك، شاهد من في البلدة، وتحدَّ أي لاعب في مبارزة ودّية.',
f7_h: 'زعماء، إنجازات، أكياس غامضة', f7_p: 'مبارزات ضد الزعماء، إنجازات تطاردها، وكيس غامض بين حين وآخر بعد الفوز.',
f8_h: 'لوحة الصدارة والسجل', f8_p: 'اعرف ترتيبك عالمياً. كل مبارزة في سجلك: الذهب، الخبرة، وتغيّر المكافأة.',
how_k: 'كيف تعمل', how_h: 'بيتا، لا نسخة تجريبية.',
s1_h: 'iPhone و Android', s1_p: 'يثبّت المختبرون التطبيق عبر TestFlight على iPhone أو Google Play على Android، ويلعبون اللعبة الحقيقية مع لاعبين حقيقيين.',
s2_h: 'إصدارات جديدة باستمرار', s2_p: 'الإصلاحات والميزات تصدر فور جاهزيتها. يرسل المختبرون ملاحظاتهم في <span lang="en">#beta-feedbacks</span> على Discord — كل تقرير مهم.',
s3_h: 'الإطلاق للجميع، 6 ديسمبر', s3_p: 'في 6 ديسمبر، يُفتح High Noon للجميع على App Store و Google Play. بلا دعوة. التحميل مجاني.',
opt_k: 'الآن', opt_h: 'لا طابور بعد الآن.<br>في 6 ديسمبر، الباب مفتوح.',
opt_p: 'البيتا ممتلئة وتُغلق في 6 ديسمبر، حين تُفتح اللعبة للجميع. إليك ما يمكنك فعله حتى ذلك الحين.',
o1_tag: 'مجاناً', o1_h: 'انضم إلى قائمة الإطلاق',
o1_p: 'اترك بريدك الإلكتروني لتصلك برقية واحدة لحظة صدور High Noon على App Store و Google Play. بلا إزعاج.',
o1_cta: 'انضم إلى قائمة الإطلاق ←', o1_fine: 'رسالة واحدة عند الإطلاق · iOS و Android',
o2_tag: 'اختياري', o2_h: 'ادعم المطوّرين',
o2_p: 'أعجبك ما نبنيه؟ ساهم بـ <span dir="ltr">$4.99</span> أو بالمبلغ الذي تريده، مرة واحدة. <b>هذا لا يشتري أي شيء داخل اللعبة. يشتري لنا القهوة ويُبقي الخوادم تعمل.</b> لا أولوية، لا عناصر داخل اللعبة — فقط شكرنا، واسمك على جدار الداعمين عندما نُطلقه.',
o2_cta: 'ادعم High Noon', o2_fine: 'مرة واحدة · أنت تختار المبلغ · دفع آمن عبر Stripe · لا يشمل الدخول',
faq_k: 'أسئلة سريعة',
q1: 'أنت مختبر بالفعل؟', a1: 'انشر ما تجده في <span lang="en">#beta-feedbacks</span> على Discord. أخطاء، أفكار، كل شيء.',
q2: 'اشتريت سكنات في الألفا؟', a2: 'إنها بانتظارك في التطبيق على الحساب نفسه. تلك المشتريات هي ما موّل التطبيق — شكراً لك.',
q3: 'على Android؟', a3: 'الإطلاق نفسه، في اليوم نفسه: 6 ديسمبر على Google Play.',
q4: 'لست في البيتا؟', a4: 'لم تعد بحاجة إليها: اللعبة تُفتح للجميع في 6 ديسمبر. استلم برقية الإطلاق من <a href="/#notify">الصفحة الرئيسية</a>، وانضم إلى الفرقة على <a href="https://discord.gg/k8mKZS4XHM" target="_blank" rel="noopener noreferrer">Discord</a>.',
home: 'الرئيسية', privacy: 'سياسة الخصوصية', cookies: 'إعدادات ملفات الارتباط', legal: 'الإشعار القانوني',
copy: '<span dir="ltr">© 2026 LEMON TREE.</span> علامتا App Store و Google Play التجاريتان مملوكتان لأصحابهما.',
sticky_k: 'يصدر 6 ديسمبر', sticky_s: 'iOS · Android', sticky_cta: 'قائمة الإطلاق', st_date: '6 ديسمبر',
// launch day (December 6, 2026, 12:00 Paris)
bar_k_live: 'High Noon متوفر الآن', bar_s_live: 'كل الروابط على الصفحة الرئيسية ←', hero_h_live: 'انتهت البيتا.', status_live: 'الجميع في الداخل الآن',
hero_p_live: 'نسخة التطبيق من High Noon كانت بين أيدي أول المختبرين منذ 31 أكتوبر 2026. منذ 6 ديسمبر، أصبحت متاحة للجميع.', hero_cta_live: 'احصل على اللعبة', a4_live: 'لم تعد بحاجة إليها: اللعبة متاحة للجميع منذ 6 ديسمبر. الروابط على <a href="/">الصفحة الرئيسية</a>.',
opt_h_live: 'الباب مفتوح.', opt_p_live: 'انتهت البيتا: High Noon متاح للجميع. ما زال بإمكانك دعم المطوّرين.', sticky_k_live: 'متوفر الآن', sticky_cta_live: 'احصل على اللعبة'
};
if (LANG === 'ar') {
$$('[data-i18n]').forEach(el => { const s = AR[el.dataset.i18n]; if (s == null) return; /<[a-z]/i.test(s) ? el.innerHTML = s : el.textContent = s; });
}
// EN / AR button: shows the other language, remembers the choice, reloads on the explicit ?lang= URL (keeps ?thanks=1)
const langBtn = $('#lang');
if (langBtn) {
const next = LANG === 'ar' ? 'en' : 'ar';
langBtn.textContent = next === 'ar' ? 'عربي' : 'EN';
langBtn.lang = next; langBtn.setAttribute('aria-label', next === 'ar' ? 'العربية' : 'English');
langBtn.addEventListener('click', () => { try { localStorage.setItem('hn_lang', next); } catch {} const q = new URLSearchParams(location.search); q.set('lang', next); location.href = location.pathname + '?' + q.toString(); });
}

// anchors
$$('a[href^="#"]:not([data-consent-open])').forEach(a => a.addEventListener('click', e => {
const h = a.getAttribute('href'); if (!h || h[0] !== '#' || h.length < 2) return;
const t = $(h); if (!t) return; e.preventDefault();
window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 8, behavior: RM ? 'auto' : 'smooth' });
}));

// scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach(el => io.observe(el));

// back from the Stripe success page: show the thank-you block once, count the purchase once per browser session
const thanks = $('#thanks');
if (thanks && new URLSearchParams(location.search).get('thanks') === '1') {
thanks.hidden = false;
let seen = false; try { seen = sessionStorage.getItem('hn_thanks') === '1'; sessionStorage.setItem('hn_thanks', '1'); } catch {}
if (!seen) px('Purchase', { value: 4.99, currency: 'USD', content_name: 'Support High Noon' });
}

// outbound / intent clicks
$$('a[href="/#notify"]').forEach(a => a.addEventListener('click', () => { if (!a.dataset.live) px('LaunchListClick', {}, true); }));
$$('a[href*="discord.gg"]').forEach(a => a.addEventListener('click', () => px('DiscordClick', {}, true)));
const support = $('#support');
if (support) support.addEventListener('click', () => px('InitiateCheckout', { value: 4.99, currency: 'USD', content_name: 'Support High Noon' }));

// launch day: same moment as the home page countdown (landing.js); the banner and the sticky then lead to the home page and its store buttons
const LAUNCH = Date.parse('2026-12-06T11:00:00Z');   // Sunday December 6, 2026, 12:00 Paris time
const tr = (k, en) => (LANG === 'ar' && AR[k] != null) ? AR[k] : en;
const setT = (el, k, en) => { if (el) el.textContent = tr(k, en); };
const setH = (el, k, en) => { if (el) el.innerHTML = tr(k, en); };   // constant strings from this file only
const HOME = LANG === 'ar' ? '/?lang=ar' : '/';
const goLive = () => {
const bar = $('#launchBar'); if (bar) { bar.href = HOME; bar.dataset.live = '1'; setT($('b', bar), 'bar_k_live', 'High Noon is out now'); setT($('span', bar), 'bar_s_live', 'All the store links are on the home page →'); }
setT($('#betaH'), 'hero_h_live', 'The beta is over.'); setT($('#betaStatus'), 'status_live', "Everyone's in now");
setT($('#betaP'), 'hero_p_live', 'The app version of High Noon was in the hands of its first testers from October 31, 2026. Since December 6, it is out for everyone.');
const hc = $('#betaCta'); if (hc) { hc.href = HOME; hc.dataset.live = '1'; setT(hc, 'hero_cta_live', 'Get the game'); }
setH($('#faqA4'), 'a4_live', 'No need anymore: the game is out for everyone since December 6. The store links are on the <a href="/">home page</a>.');
const o1 = $('#optLaunch'); if (o1) o1.hidden = true;
setT($('#optH'), 'opt_h_live', "It's open."); setT($('#optP'), 'opt_p_live', 'The beta is over: High Noon is out for everyone. You can still support the devs.');
setT($('#stickyK'), 'sticky_k_live', 'Out now'); const sb = $('#stickyBtn'); if (sb) { sb.href = HOME; sb.dataset.live = '1'; setT(sb, 'sticky_cta_live', 'Get the game'); }
};
let bt = 0;
const btick = () => { clearTimeout(bt); const left = LAUNCH - Date.now(); if (left <= 0) { goLive(); return; } bt = setTimeout(btick, Math.min(left + 50, 60000)); };
document.addEventListener('visibilitychange', () => { if (!document.hidden) btick(); });
btick();

// sticky CTA — hidden over the options block (its own buttons) and the thank-you block
const sticky = $('#sticky');
if (sticky) {
const hid = new Set();
const upd = () => sticky.classList.toggle('show', hid.size === 0);
const obs = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? hid.add(e.target) : hid.delete(e.target)); upd(); }, { threshold: .15 });
[$('#options'), thanks && !thanks.hidden ? thanks : null].forEach(el => el && obs.observe(el));
setTimeout(upd, 1800);
}
})();
