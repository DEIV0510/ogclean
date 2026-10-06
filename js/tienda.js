/* ============================================================
   OGCLEAN · TIENDA
   Página de compra con todos los productos y filtros.
   ============================================================ */

import { initComun, alCargar } from './comun.js';
import { initShop } from './sections/shop.js';
import { initVitrina } from './sections/vitrina.js';

alCargar(() => {
  initShop();   // primero los productos: es lo que vienen a ver
  initComun();
  // La vitrina de la cabecera es decoración: sus fotos se piden cuando la página ya cargó
  if (document.readyState === 'complete') initVitrina();
  else window.addEventListener('load', initVitrina, { once: true });
});
