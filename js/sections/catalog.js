/* Catálogo con pestañas (gorras / tenis), filtros por categoría y conteo vivo. */

import { qs, qsa } from '../utils/dom.js';
import { LINEAS } from '../data/products.js';
import { renderCards } from '../components/productCard.js';
import { initReveals } from '../utils/motion.js';

let lineaActual = 'caps';
let filtroActual = 'all';

function pintarFiltros(cont) {
  const linea = LINEAS[lineaActual];
  cont.innerHTML = linea.filtros
    .map((f) => `<button class="chip${f.id === filtroActual ? ' is-active' : ''}" type="button" data-filtro="${f.id}">${f.label}</button>`)
    .join('');
}

function aplicarFiltro(grid, countEl) {
  const linea = LINEAS[lineaActual];
  let visibles = 0;
  qsa('.card', grid).forEach((card) => {
    const ok = filtroActual === 'all' || card.dataset.cat === filtroActual;
    card.classList.toggle('is-hidden', !ok);
    if (ok) visibles += 1;
  });
  if (countEl) {
    countEl.textContent = `${visibles} ${visibles === 1 ? linea.singular : linea.plural} · ${lineaActual === 'caps' ? '$85.000' : '$185.000'}`;
  }
}

function pintarGrid(grid, countEl, filtrosEl) {
  const linea = LINEAS[lineaActual];
  renderCards(grid, linea.items);
  pintarFiltros(filtrosEl);
  aplicarFiltro(grid, countEl);
  initReveals(grid);
}

export function initCatalog() {
  const grid = qs('#catalogoGrid');
  const countEl = qs('#catalogoCount');
  const filtrosEl = qs('#catalogoFiltros');
  const tabs = qsa('.catalogo__tab');
  if (!grid || !filtrosEl) return;

  const cambiarLinea = (id) => {
    if (!LINEAS[id]) return;
    lineaActual = id;
    filtroActual = 'all';
    tabs.forEach((t) => {
      const activo = t.dataset.tab === id;
      t.classList.toggle('is-active', activo);
      t.setAttribute('aria-selected', String(activo));
    });
    grid.setAttribute('aria-labelledby', `tab-${id}`);
    pintarGrid(grid, countEl, filtrosEl);
  };

  tabs.forEach((t) => t.addEventListener('click', () => cambiarLinea(t.dataset.tab)));

  filtrosEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    filtroActual = chip.dataset.filtro;
    qsa('.chip', filtrosEl).forEach((c) => c.classList.toggle('is-active', c === chip));
    aplicarFiltro(grid, countEl);
  });

  // Los CTA de la sección "Líneas" abren la pestaña correspondiente
  qsa('[data-tab]').forEach((el) => {
    if (el.classList.contains('catalogo__tab')) return;
    el.addEventListener('click', () => cambiarLinea(el.dataset.tab));
  });

  pintarGrid(grid, countEl, filtrosEl);
}
