/* Vergers de la Garenne : menu mobile, ombre d'en-tête, bascule FR/EN, révélations, compteurs.
   Sans JavaScript, tout reste visible et utilisable (masquages conditionnés par html.js). */
window.vgMotion = true;
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function closeMenu() {
    if (!burger) { return; }
    burger.setAttribute('aria-expanded', 'false');
    doc.classList.remove('menu-open');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      doc.classList.toggle('menu-open', !open);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) { closeMenu(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); } });
  }

  var header = document.querySelector('.site-header');
  function onScroll() { if (header) { header.classList.toggle('is-scrolled', window.scrollY > 24); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  [].forEach.call(document.querySelectorAll('.lang-switch'), function (sw) {
    sw.addEventListener('click', function () {
      var cur = '';
      [].forEach.call(document.querySelectorAll('main section[id]'), function (s) {
        if (s.getBoundingClientRect().top < window.innerHeight / 3) { cur = s.id; }
      });
      if (cur) { sw.href = sw.href.split('#')[0] + '#' + cur; }
    });
  });

  var els = [].slice.call(document.querySelectorAll('.rv, .rv-media'));
  var nums = [].slice.call(document.querySelectorAll('[data-count]'));
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (e) { io.observe(e); });

  var io2 = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) { return; }
      io2.unobserve(en.target);
      var el = en.target;
      var to = parseInt(el.getAttribute('data-count'), 10);
      var from = parseInt(el.getAttribute('data-from') || '0', 10);
      var t0 = null;
      function step(t) {
        if (t0 === null) { t0 = t; }
        var p = Math.min((t - t0) / 1400, 1);
        el.textContent = String(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
        if (p < 1) { requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  nums.forEach(function (e) { io2.observe(e); });
})();
