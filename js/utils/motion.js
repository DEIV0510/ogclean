/* Motor de animación ligero: reveals, contadores, parallax y marquees.
   Todo con IntersectionObserver + rAF (GPU friendly, sin librerías). */

import { qsa, reducedMotion, rafThrottle, splitWords } from './dom.js';

/** Reveals por scroll: [data-anim], .clip-reveal y [data-split]. */
export function initReveals(root = document) {
  const targets = qsa('[data-anim], .clip-reveal, [data-split]', root);
  if (!targets.length) return;

  if (reducedMotion) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.hasAttribute('data-split')) {
        splitWords(el).forEach((w, i) => { w.style.setProperty('--d', `${i * 0.055}s`); });
        el.classList.add('words-in');
      }
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  targets.forEach((el) => io.observe(el));
}

/** Contadores animados en [data-count]. */
export function initCounters() {
  const nums = qsa('[data-count]');
  if (!nums.length) return;

  const animar = (el) => {
    const final = Number(el.dataset.count) || 0;
    if (reducedMotion) { el.textContent = final; return; }
    const dur = 1300;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(final * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      animar(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  nums.forEach((n) => io.observe(n));
}

/** Parallax suave en [data-parallax] (factor por elemento). */
export function initParallax() {
  const items = qsa('[data-parallax]');
  if (!items.length || reducedMotion) return;

  const update = rafThrottle(() => {
    const vh = window.innerHeight;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const factor = parseFloat(el.dataset.parallax) || 0.1;
      const centro = r.top + r.height / 2 - vh / 2;
      el.style.translate = `0 ${(-centro * factor).toFixed(1)}px`;
    });
  });

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/** Duplica el contenido de los tracks marquee para un loop continuo. */
export function initMarquees() {
  qsa('[data-marquee]').forEach((track) => {
    if (track.dataset.cloned === '1' || !track.children.length) return;
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = '1';
  });
}

/** Tilt 3D con seguimiento del mouse (solo punteros finos). */
export function tilt(el, { max = 9, scale = 1.02 } = {}) {
  if (reducedMotion) return;
  let raf = 0;
  const mover = (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) scale(${scale})`;
    });
  };
  const salir = () => {
    cancelAnimationFrame(raf);
    el.style.transform = '';
  };
  el.addEventListener('mousemove', mover);
  el.addEventListener('mouseleave', salir);
}
