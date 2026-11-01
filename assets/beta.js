// beta.html — language swap (EN/AR), scroll reveal, "?thanks=1" block after a Stripe payment, click events for the pixel
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const px = (...a) => window.hnTrack && window.hnTrack(...a);   // Meta Pixel event, a no-op when the pixel is off (consent.js)
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

// i18n — <html lang dir> is set by lang.js before first paint; the HTML stays English (= fallback). Arabic copy: pending native review.
const LANG = document.documentElement.lang === 'ar' ? 'ar' : 'en';
const AR = {
hero_k: 'برنامج البيتا · iOS و Android', hero_h: 'انضم إلى البيتا.', status: 'البيتا جارية — المقاعد ممتلئة حالياً',
hero_p: 'نسخة التطبيق من High Noon بين أيدي أول دفعة من المختبرين على iPhone و Android منذ 31 أكتوبر 2026.',
st_players: 'لاعب في الألفا', st_duels: 'مبارزة خاضوها', st_now: 'في البيتا الآن', hero_cta: 'كيف تدخل؟',
th_k: '★ ممتنّون لك ★', th_h: 'شكراً يا شريك.',
th_p: 'وصل دعمك للتو. يُبقي الخوادم تعمل والقهوة ساخنة. لا يغيّر مكانك في طابور البيتا — لكنه يعني الكثير للفريق.',
th_discord: 'انضم إلى الفرقة على Discord',
feat_k: 'ما ستختبره', feat_h: 'اللعبة كاملة.', feat_p: 'ليس جزءاً منها. كل ما هو متاح في التطبيق، مع إصدارات جديدة تصل باستمرار.',
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
s3_h: 'الدعوات بالبريد الإلكتروني', s3_p: 'عندما تُفتح المقاعد، تصلك رسالة بالبريد الإلكتروني فيها رابطك. قائمة انتظار واحدة للمنصتين. لا شيء تدفعه.',
opt_k: 'الآن', opt_h: 'البيتا ممتلئة.<br>إليك ما يمكنك فعله.',
opt_p: 'كل المقاعد محجوزة. نفتح مقاعد جديدة على دفعات صغيرة كلما سمحت الخوادم وطاقة الفريق بذلك.',
o1_tag: 'مجاناً', o1_h: 'انضم إلى قائمة الانتظار',
o1_p: 'املأ النموذج. عندما تُفتح المقاعد، تُرسل الدعوات بالبريد الإلكتروني على دفعات صغيرة وبالترتيب. لا موعد محدداً — لكن كل اسم في القائمة سيأتي دوره.',
o1_tip: 'متابعونا على TikTok و Instagram و Facebook أولاً — سيسألك النموذج عن ذلك.',
o1_cta: 'انضم إلى قائمة الانتظار ←', o1_fine: 'نموذج Google · iOS و Android',
o2_tag: 'اختياري', o2_h: 'ادعم المطوّرين',
o2_p: 'أعجبك ما نبنيه؟ ساهم بـ <span dir="ltr">$4.99</span> أو بالمبلغ الذي تريده، مرة واحدة. <b>هذا لا يشتري دخول البيتا. يشتري لنا القهوة ويُبقي الخوادم تعمل.</b> لا أولوية، لا عناصر داخل اللعبة — فقط شكرنا، واسمك على جدار الداعمين عندما نُطلقه.',
o2_cta: 'ادعم High Noon', o2_fine: 'مرة واحدة · أنت تختار المبلغ · دفع آمن عبر Stripe · لا يشمل الدخول',
faq_k: 'أسئلة سريعة',
q1: 'أنت مختبر بالفعل؟', a1: 'انشر ما تجده في <span lang="en">#beta-feedbacks</span> على Discord. أخطاء، أفكار، كل شيء.',
q2: 'اشتريت سكنات في الألفا؟', a2: 'إنها بانتظارك في التطبيق على الحساب نفسه. تلك المشتريات هي ما موّل التطبيق — شكراً لك.',
q3: 'على Android؟', a3: 'البيتا نفسها، وقائمة الانتظار نفسها. يتلقى مختبرو Android رابط Google Play بالبريد الإلكتروني.',
q4: 'لست في البيتا بعد؟', a4: 'استلم برقية الإطلاق من <a href="/#notify">الصفحة الرئيسية</a>، وانضم إلى الفرقة على <a href="https://discord.gg/k8mKZS4XHM" target="_blank" rel="noopener noreferrer">Discord</a>.',
home: 'الرئيسية', privacy: 'سياسة الخصوصية', cookies: 'إعدادات ملفات الارتباط',
copy: '<span dir="ltr">© 2026 High Noon Reborn.</span> علامتا App Store و Google Play التجاريتان مملوكتان لأصحابهما.',
sticky_k: 'ممتلئة حالياً', sticky_s: 'البيتا · قائمة انتظار مجانية', sticky_cta: 'قائمة الانتظار'
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
const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault();
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
$$('a[href*="forms.gle"]').forEach(a => a.addEventListener('click', () => px('BetaWaitlistClick', {}, true)));
$$('a[href*="discord.gg"]').forEach(a => a.addEventListener('click', () => px('DiscordClick', {}, true)));
const support = $('#support');
if (support) support.addEventListener('click', () => px('InitiateCheckout', { value: 4.99, currency: 'USD', content_name: 'Support High Noon' }));

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
