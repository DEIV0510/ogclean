/* Manifiesto: el texto se ilumina palabra por palabra con el scroll.
   Además carga el video del hero solo cuando conviene y arma la tira social. */

import { qs, qsa, splitWords, reducedMotion, rafThrottle, mq } from '../utils/dom.js';
import { TODOS } from '../data/products.js';

export function initManifiesto() {
  const el = qs('#manifiestoText');
  if (!el) return;
  const palabras = splitWords(el);
  if (!palabras.length) return;
  el.classList.add('words-in'); // las palabras entran de una: aquí el efecto es el color

  if (reducedMotion) {
    palabras.forEach((w) => w.classList.add('is-lit'));
    return;
  }

  const update = rafThrottle(() => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 cuando el bloque entra por abajo, 1 cuando pasa el centro
    const progreso = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
    const hasta = Math.round(progreso * palabras.length);
    palabras.forEach((w, i) => w.classList.toggle('is-lit', i < hasta));
  });

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/** El video del hero se carga solo si hay ancho y conexión razonables. */
export function initHeroVideo() {
  const video = qs('#heroVideo');
  if (!video) return;

  // Con ahorro de datos activo queda el póster: no gastamos el plan del visitante
  const conexion = navigator.connection;
  if (conexion && (conexion.saveData || /(^|-)2g$/.test(conexion.effectiveType || ''))) return;

  // El archivo liviano en móvil, el grande solo en pantallas anchas
  const base = mq('(min-width: 768px)') ? 'assets/video/hero' : 'assets/video/hero-mobile';

  video.muted = true;          // requisito para el autoplay en todos los navegadores
  video.defaultMuted = true;
  video.playsInline = true;

  if (video.dataset.cargado !== '1') {
    video.dataset.cargado = '1';
    video.innerHTML = `
      <source src="${base}.webm" type="video/webm">
      <source src="${base}.mp4" type="video/mp4">`;
    video.load();
  }

  const reproducir = () => {
    if (!video.paused) return;
    const intento = video.play();
    if (intento && intento.catch) intento.catch(() => {});
  };

  reproducir();
  video.addEventListener('loadeddata', reproducir);
  video.addEventListener('canplay', reproducir);

  // Si el navegador bloquea el autoplay, el primer gesto del visitante lo destraba
  const alPrimerGesto = () => {
    reproducir();
    ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((ev) =>
      window.removeEventListener(ev, alPrimerGesto));
  };
  ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((ev) =>
    window.addEventListener(ev, alPrimerGesto, { once: false, passive: true }));

  // Al volver a la pestaña algunos navegadores lo dejan pausado
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) reproducir();
  });
}

/** Tira infinita de miniaturas reales sobre la sección de redes. */
export function initSocialStrip() {
  const strip = qs('#socialStrip');
  if (!strip) return;
  const muestra = [...TODOS].sort(() => 0.5 - Math.random()).slice(0, 12);
  strip.innerHTML = muestra
    .map((p) => `<div class="social__thumb"><img src="${p.srcSm}" alt="${p.alt}" loading="lazy" decoding="async" width="300" height="300"></div>`)
    .join('');
}

/** Paneles de líneas: activa el panel al pasar el mouse o enfocarlo. */
export function initLineas() {
  const paneles = qsa('.linea');
  paneles.forEach((panel) => {
    const activar = () => paneles.forEach((p) => p.classList.toggle('is-active', p === panel));
    panel.addEventListener('mouseenter', activar);
    panel.addEventListener('focus', activar);
  });
}
