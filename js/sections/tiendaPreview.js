/* Vista previa de la tienda en el inicio: accesos por categoría y marca,
   una fila corta de productos con compra rápida y salto a tienda.html. */

import { qs } from '../utils/dom.js';
import { TODOS, DESTACADOS } from '../data/products.js';
import { renderCards } from '../components/productCard.js';
import { initCompraRapida } from '../components/compraRapida.js';
import { initReveals } from '../utils/motion.js';

const enlace = (params) => `tienda.html?${new URLSearchParams(params).toString()}`;

export function initTiendaPreview() {
  const cats = qs('#previewCategorias');
  const marcas = qs('#previewMarcas');
  const grid = qs('#previewGrid');
  if (!grid) return;

  const cuenta = (g) => TODOS.filter((p) => p.grupo === g).length;

  if (cats) {
    const portada = {
      'Gorras cerradas': 'assets/img/caps/yankees-negro-oro-sm.webp',
      'Gorras ajustables': 'assets/img/gorras/los-angeles-dodgers-naranja-pespunte-sm.webp',
      'Básquetbol': 'assets/img/zapatos/jordan-air-jordan-4-blanco-rosa-sm.webp',
      'Zapatillas hombre': 'assets/img/zapatos/nike-dunk-low-blanco-negro-sm.webp',
      'Zapatillas dama': 'assets/img/zapatos/on-cloud-crema-rosa-sm.webp',
      Botas: 'assets/img/zapatos/timberland-bota-6-trigo-monograma-sm.webp',
    };
    cats.innerHTML = ['Básquetbol', 'Zapatillas hombre', 'Zapatillas dama', 'Gorras cerradas', 'Gorras ajustables', 'Botas'].map((g) => `
      <a class="preview-cat" href="${enlace({ categoria: g })}">
        <img src="${portada[g]}" alt="" loading="lazy" decoding="async" width="560" height="560">
        <span class="preview-cat__txt">
          <span class="preview-cat__n mono">${cuenta(g)} productos</span>
          <span class="preview-cat__t">${g}</span>
        </span>
        <span class="preview-cat__flecha" aria-hidden="true">→</span>
      </a>`).join('');
  }

  if (marcas) {
    const conteo = {};
    TODOS.forEach((p) => { if (p.marca !== 'Otras') conteo[p.marca] = (conteo[p.marca] || 0) + 1; });
    // Portada curada por marca (una foto real y representativa, no "la primera que salga")
    const portadaMarca = {
      Nike: 'assets/img/sneakers/kyrie3-blanco-sm.webp',
      Adidas: 'assets/img/zapatos/adidas-trefoil-low-blanco-gris-sm.webp',
      Salomon: 'assets/img/zapatos/salomon-xt-6-crema-cafe-sm.webp',
      Jordan: 'assets/img/zapatos/jordan-air-jordan-11-blanco-negro-charol-sm.webp',
      'New Balance': 'assets/img/zapatos/new-balance-running-blanco-plata-sm.webp',
      On: 'assets/img/zapatos/on-cloud-blanco-gris-sm.webp',
    };
    marcas.innerHTML = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .filter(([m]) => portadaMarca[m])
      .slice(0, 6)
      .map(([m, n]) => `
        <a class="preview-cat preview-marca" href="${enlace({ marca: m })}">
          <img src="${portadaMarca[m]}" alt="" loading="lazy" decoding="async" width="560" height="560">
          <span class="preview-cat__txt">
            <span class="preview-cat__n mono">${n} productos</span>
            <span class="preview-cat__t">${m}</span>
          </span>
          <span class="preview-cat__flecha" aria-hidden="true">→</span>
        </a>`)
      .join('');
  }

  renderCards(grid, DESTACADOS.slice(8, 12), { sizes: '(max-width: 700px) 46vw, (max-width: 1100px) 30vw, 22vw' });
  initCompraRapida(grid);
  initReveals(grid);

  const total = qs('#previewTotal');
  if (total) total.textContent = TODOS.length;
}
