/* ============================================================
   OGCLEAN · APP
   Orquesta la experiencia: primero lo que se ve, luego lo pesado.
   ============================================================ */

import { qs, qsa, whenGsap, reducedMotion } from './utils/dom.js';
import { SITE, wa } from './data/site.js';
import { initReveals, initCounters, initParallax, initMarquees } from './utils/motion.js';
import { initLoader } from './components/loader.js';
import { initHeader, initMenu, initScrollSpy } from './components/nav.js';
import { initCursor, initMagnetic } from './components/cursor.js';
import { initQuickView } from './components/quickview.js';
import { initCart } from './components/cart.js';
import { initCatalog } from './sections/catalog.js';
import { initCombo } from './sections/combo.js';
import { initRunway } from './sections/runway.js';
import { initFocus } from './sections/focus.js';
import { initManifiesto, initHeroVideo, initSocialStrip, initLineas } from './sections/storytelling.js';

/** Enlaza todos los CTA de WhatsApp (línea 1 y línea 2). */
function initWhatsApp() {
  qsa('.js-wa').forEach((el) => {
    el.href = wa(el.dataset.wa || 'Hola OGCLEAN, quiero más información.');
    el.target = '_blank';
    el.rel = 'noopener';
  });
  qsa('.js-wa2').forEach((el) => {
    el.href = wa(el.dataset.wa || 'Hola OGCLEAN, quiero más información.', SITE.whatsapp.linea2.numero);
    el.target = '_blank';
    el.rel = 'noopener';
  });
}

function initAnio() {
  const y = qs('#year');
  if (y) y.textContent = new Date().getFullYear();
}

function arrancar() {
  // 1 · Contenido y estructura (barato, inmediato)
  initWhatsApp();
  initAnio();
  initHeroVideo(); // cuanto antes arranque, antes se ve el hero en movimiento
  initCatalog();
  initCombo();
  initSocialStrip();
  initMarquees();
  initLineas();
  initCart();
  initQuickView();

  // 2 · Navegación e interacción
  initHeader();
  initMenu();
  initScrollSpy();
  initCursor();
  initMagnetic();

  // 3 · Movimiento
  initReveals();
  initCounters();
  initParallax();
  initManifiesto();

  // 4 · Lo pesado, cuando el navegador esté libre
  const pesado = () => {
    whenGsap().then((gsap) => {
      if (gsap && !reducedMotion) {
        gsap.registerPlugin(window.ScrollTrigger);
        initRunway(gsap);
        initFocus(gsap);
        window.ScrollTrigger.refresh();
      } else {
        initRunway(null);
        initFocus(null);
      }
    });
  };

  if ('requestIdleCallback' in window) requestIdleCallback(pesado, { timeout: 900 });
  else setTimeout(pesado, 300);
}

initLoader();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', arrancar, { once: true });
} else {
  arrancar();
}
