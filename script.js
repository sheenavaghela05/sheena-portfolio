function initRevealAndCarousels(root) {
  root = root || document;

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    root.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    root.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }

  root.querySelectorAll('[data-carousel]').forEach((carouselRoot) => {
    const track = carouselRoot.querySelector('.carousel-track');
    const slides = Array.from(track.children);

    if (slides.length <= 1) {
      carouselRoot.classList.add('single');
      return;
    }

    const nav = document.createElement('div');
    nav.className = 'carousel-nav';

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'carousel-btn carousel-prev';
    prev.setAttribute('aria-label', 'Previous image');
    prev.textContent = '←';

    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    const dotEls = slides.map((slide, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dots.appendChild(dot);
      return dot;
    });

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'carousel-btn carousel-next';
    next.setAttribute('aria-label', 'Next image');
    next.textContent = '→';

    nav.append(prev, dots, next);
    carouselRoot.appendChild(nav);

    let current = 0;
    function goTo(i) {
      current = Math.max(0, Math.min(slides.length - 1, i));
      slides[current].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          const idx = slides.indexOf(entry.target);
          if (idx !== -1) {
            current = idx;
            dotEls.forEach((d, i) => d.classList.toggle('active', i === idx));
          }
        }
      });
    }, { root: track, threshold: [0.6] });
    slides.forEach((s) => io.observe(s));
  });
}

window.initRevealAndCarousels = initRevealAndCarousels;
initRevealAndCarousels(document);
