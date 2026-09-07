/* Sección "en foco": el producto crece con el scroll y los pasos se van
   encendiendo uno a uno. Sin GSAP cae a un IntersectionObserver simple. */

import { qs, qsa, reducedMotion, clamp, rafThrottle } from '../utils/dom.js';

export function initFocus(gsap) {
  const seccion = qs('#focus');
  const img = qs('#focusImg');
  const pasos = qsa('.focus__step');
  if (!seccion || !img || !pasos.length) return;

  const encender = (i) => pasos.forEach((p, idx) => p.classList.toggle('is-on', idx === i));

  if (reducedMotion) {
    img.style.transform = 'scale(1)';
    pasos.forEach((p) => p.classList.add('is-on'));
    return;
  }

  const aplicar = (progreso) => {
    const p = clamp(progreso, 0, 1);
    img.style.transform = `scale(${(0.86 + p * 0.2).toFixed(3)}) rotate(${(p * 8).toFixed(2)}deg)`;
    encender(Math.min(Math.floor(p * pasos.length), pasos.length - 1));
  };

  if (gsap) {
    gsap.to({}, {
      scrollTrigger: {
        trigger: seccion,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => aplicar(self.progress),
      },
    });
    return;
  }

  const update = rafThrottle(() => {
    const r = seccion.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    if (total <= 0) return;
    aplicar(-r.top / total);
  });
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}
