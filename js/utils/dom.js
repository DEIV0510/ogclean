/* Utilidades mínimas de DOM y entorno. */

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const mq = (q) => window.matchMedia(q).matches;

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
export const lerp = (a, b, t) => a + (b - a) * t;

/** Envuelve cada palabra en spans para animarlas por separado. */
export function splitWords(el) {
  if (!el || el.dataset.split === 'done') return [];
  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const partes = child.textContent.split(/(\s+)/).filter((p) => p.length);
        const frag = document.createDocumentFragment();
        partes.forEach((p) => {
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const outer = document.createElement('span');
          outer.className = 'word';
          const inner = document.createElement('span');
          inner.className = 'word__i';
          inner.textContent = p;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
  el.dataset.split = 'done';
  return qsa('.word__i', el);
}

/** requestAnimationFrame con throttling por frame. */
export function rafThrottle(fn) {
  let ticking = false;
  return (...args) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn(...args);
    });
  };
}

/** Espera a que GSAP esté disponible (se carga con defer). */
export function whenGsap() {
  return new Promise((resolve) => {
    if (window.gsap && window.ScrollTrigger) return resolve(window.gsap);
    let intentos = 0;
    const t = setInterval(() => {
      intentos += 1;
      if (window.gsap && window.ScrollTrigger) { clearInterval(t); resolve(window.gsap); }
      else if (intentos > 40) { clearInterval(t); resolve(null); }
    }, 50);
  });
}
