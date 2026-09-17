/* ============================================================
   OGCLEAN · TIENDA
   Página de compra con todos los productos y filtros.
   ============================================================ */

import { initComun, alCargar } from './comun.js';
import { initShop } from './sections/shop.js';

alCargar(() => {
  initShop();   // primero los productos: es lo que vienen a ver
  initComun();
});
