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

// mailto links do nothing for visitors without a desktop mail app, so also copy the address
function showEmailToast(message) {
  let toast = document.querySelector('.email-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'email-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._hide);
  toast._hide = setTimeout(() => toast.classList.remove('show'), 3200);
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}

function legacyCopy(text) {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed; opacity:0; pointer-events:none;';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
  area.remove();
  return ok;
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="mailto:"]');
  if (!link) return;
  const address = link.getAttribute('href').slice(7);
  copyText(address).then((copied) => {
    showEmailToast(copied ? 'Email copied: ' + address : 'Email: ' + address);
  });
});
