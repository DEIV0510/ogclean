/* Lo que comparten todas las páginas: WhatsApp, header, menú, carrito,
   ficha de producto, cursor y reveals. */

import { qs, qsa } from './utils/dom.js';
import { SITE, wa } from './data/site.js';
import { initReveals, initMarquees } from './utils/motion.js';
import { initHeader, initMenu } from './components/nav.js';
import { initCursor, initMagnetic } from './components/cursor.js';
import { initQuickView } from './components/quickview.js';
import { initCart } from './components/cart.js';
import { initVisor } from './components/visor.js';
import { initFirma } from './components/firma.js';

/** Enlaza todos los CTA de WhatsApp (línea 1 y línea 2). */
export function initWhatsApp(raiz = document) {
  qsa('.js-wa', raiz).forEach((el) => {
    el.href = wa(el.dataset.wa || 'Hola OGCLEAN, quiero más información.');
    el.target = '_blank';
    el.rel = 'noopener';
  });
  qsa('.js-wa2', raiz).forEach((el) => {
    el.href = wa(el.dataset.wa || 'Hola OGCLEAN, quiero más información.', SITE.whatsapp.linea2.numero);
    el.target = '_blank';
    el.rel = 'noopener';
  });
}

function initAnio() {
  const y = qs('#year');
  if (y) y.textContent = new Date().getFullYear();
}

/** Arranque común. Cada página añade encima sus secciones propias. */
export function initComun() {
  initWhatsApp();
  initAnio();
  initMarquees();
  initCart();
  initQuickView();
  initVisor();
  initFirma();
  initHeader();
  initMenu();
  initCursor();
  initMagnetic();
  initReveals();
}

export function alCargar(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
  else fn();
}
