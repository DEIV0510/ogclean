/* Tarjeta de producto reutilizable (catálogo, runway y relacionados).
   Incluye compra rápida: botón "Comprar" → tallas → al carrito en un toque. */

import { precioCOP } from '../data/site.js';

const ojo = '<svg viewBox="0 0 24 24" fill="none" width="12" height="12" aria-hidden="true"><circle cx="11" cy="11" r="6.4" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-4.2-4.2M11 8.6v4.8M8.6 11h4.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const bolsa = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15" aria-hidden="true"><path d="M6.5 8h11l-1 11.5a1.5 1.5 0 0 1-1.5 1.4H9a1.5 1.5 0 0 1-1.5-1.4L6.5 8Z" stroke-linejoin="round"/><path d="M9.5 8V6.6a2.5 2.5 0 0 1 5 0V8" stroke-linecap="round"/></svg>';

/** Devuelve el HTML de una tarjeta. `rapida: false` la deja solo como enlace a la ficha. */
export function cardHTML(p, { sizes = '(max-width: 700px) 46vw, (max-width: 1100px) 30vw, 22vw', rapida = true } = {}) {
  const tallas = p.tallas
    .map((t) => `<button class="card__size" type="button" data-talla="${t}">${t}</button>`)
    .join('');

  return `
    <article class="card${rapida ? ' has-rapida' : ''}" data-id="${p.id}" data-cat="${p.cat}" data-idx="${p.idx}">
      <div class="card__media">
        <span class="card__tag">${p.video ? '▶ Video 360°' : p.tag}</span>
        <img src="${p.srcSm}" srcset="${p.srcSm} 560w, ${p.src} 1000w" sizes="${sizes}"
             alt="${p.alt}" loading="lazy" decoding="async" width="560" height="560">
        <span class="card__view">${ojo} Ver ficha</span>
      </div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__meta">${p.tipo} · ${p.color}</p>
        <p class="card__price${typeof p.precio === 'number' ? '' : ' is-cotizar'}">${precioCOP(p.precio)}</p>
        ${rapida ? `<button class="card__buy" type="button" data-rapida aria-label="Comprar ${p.name}, elegir talla">${bolsa} Comprar</button>` : ''}
      </div>
      <button class="card__btn js-quick" type="button" data-id="${p.id}" aria-label="Ver ficha de ${p.name}, ${p.tag}"></button>
      ${rapida ? `
      <div class="card__rapida" role="group" aria-label="Elige tu talla de ${p.name}">
        <div class="card__rapida-top">
          <span class="mono">Elige tu talla${p.unidad ? ' (US)' : ''}</span>
          <button class="card__rapida-x" type="button" data-rapida-cerrar aria-label="Cerrar tallas">✕</button>
        </div>
        <div class="card__sizes">${tallas}</div>
        <p class="card__rapida-nota mono">Toca una talla y se agrega al carrito</p>
        <a class="btn btn--primary btn--sm btn--block" data-pedir-ya href="#" target="_blank" rel="noopener" hidden>Pedir ya</a>
      </div>` : ''}
    </article>`;
}

/** Pinta una lista de productos dentro de un contenedor. */
export function renderCards(cont, items, opciones) {
  if (!cont) return;
  cont.innerHTML = items.map((p) => cardHTML(p, opciones)).join('');
}
