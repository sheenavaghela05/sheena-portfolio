(function () {
  var body = document.body;
  var hero = document.querySelector('.hm-hero');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;
  var loaded = false;

  function start() {
    loaded = true;
    body.classList.add('is-loaded');
    if (hero) hero.classList.add('hero-in');
  }

  // intro title card: plays once per session, then hands off to the hero animation
  var intro = document.getElementById('intro');
  var root = document.documentElement;
  if (intro && !root.classList.contains('no-intro')) {
    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      intro.classList.add('exit');
      try { sessionStorage.setItem('introSeen', '1'); } catch (err) {}
      setTimeout(function () {
        root.classList.add('no-intro');
        intro.remove();
      }, 850);
      setTimeout(start, 350);
    };
    void intro.offsetWidth; // commit the starting state so the transitions run
    setTimeout(function () { intro.classList.add('play'); }, 30);
    var timer = setTimeout(finish, 2600);
    var skip = function () { clearTimeout(timer); finish(); };
    intro.addEventListener('click', skip);
    document.addEventListener('keydown', skip, { once: true });
  } else {
    if (intro) intro.remove();
    setTimeout(start, 60);
  }

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
