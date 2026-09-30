(function () {
  var body = document.body;
  var hero = document.querySelector('.hm-hero');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;
  var loaded = false;

  setTimeout(function () {
    loaded = true;
    body.classList.add('is-loaded');
    if (hero) hero.classList.add('hero-in');
  }, 60);

  if (!canObserve || reduce) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  // replay the hero animation every time the visitor scrolls back up to it
  if (hero) {
    new IntersectionObserver(function (entries) {
      hero.classList.toggle('hero-in', loaded && entries[0].isIntersecting);
    }, { threshold: 0.25 }).observe(hero);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
})();
