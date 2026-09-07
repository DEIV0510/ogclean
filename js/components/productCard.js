/* Tarjeta de producto reutilizable (catálogo, runway y relacionados). */

import { precioCOP } from '../data/site.js';

const ojo = '<svg viewBox="0 0 24 24" fill="none" width="12" height="12" aria-hidden="true"><circle cx="11" cy="11" r="6.4" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-4.2-4.2M11 8.6v4.8M8.6 11h4.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

/** Devuelve el HTML de una tarjeta. `sizes` controla el srcset responsive. */
export function cardHTML(p, { sizes = '(max-width: 700px) 46vw, (max-width: 1100px) 30vw, 22vw' } = {}) {
  return `
    <article class="card" data-id="${p.id}" data-cat="${p.cat}" data-idx="${p.idx}">
      <div class="card__media">
        <span class="card__tag">${p.tag}</span>
        <img src="${p.srcSm}" srcset="${p.srcSm} 500w, ${p.src} 1000w" sizes="${sizes}"
             alt="${p.alt}" loading="lazy" decoding="async" width="500" height="500">
        <span class="card__view">${ojo} Ver ficha</span>
      </div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__meta">${p.tipo} · ${p.color}</p>
        <p class="card__price">${precioCOP(p.precio)}</p>
      </div>
      <button class="card__btn js-quick" type="button" data-id="${p.id}" aria-label="Ver ficha de ${p.name}, ${p.tag}"></button>
    </article>`;
}

/** Pinta una lista de productos dentro de un contenedor. */
export function renderCards(cont, items, opciones) {
  if (!cont) return;
  cont.innerHTML = items.map((p) => cardHTML(p, opciones)).join('');
}
