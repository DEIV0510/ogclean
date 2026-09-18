/* Tarjeta de producto reutilizable (inicio, tienda, pasarela y relacionados).
   Estructura pensada para vender rápido:
   foto + ojo (visor) → nombre → precio (y precio anterior tachado si es real)
   → tallas a la vista → "Ver producto" + "Agregar". */

import { precioCOP } from '../data/site.js';
import { descuento, tienePrecio } from '../data/products.js';

const ojo = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="20" height="20" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke-linejoin="round"/><circle cx="12" cy="12" r="3"/></svg>';
const bolsa = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15" aria-hidden="true"><path d="M6.5 8h11l-1 11.5a1.5 1.5 0 0 1-1.5 1.4H9a1.5 1.5 0 0 1-1.5-1.4L6.5 8Z" stroke-linejoin="round"/><path d="M9.5 8V6.6a2.5 2.5 0 0 1 5 0V8" stroke-linecap="round"/></svg>';

const TALLAS_A_LA_VISTA = 5;

/** Precio principal arriba y, si hay precio anterior real, tachado debajo. */
export function precioHTML(p, clase = 'card') {
  const d = descuento(p);
  if (!tienePrecio(p)) return `<p class="${clase}__price is-cotizar">${precioCOP(p.precio)}</p>`;
  return `
    <div class="${clase}__precios">
      <p class="${clase}__price">${precioCOP(p.precio)} <span class="${clase}__cop">COP</span></p>
      ${d ? `<p class="${clase}__antes"><span class="sr-only">Antes </span><s>${precioCOP(d.antes)}</s></p>` : ''}
    </div>`;
}

/** Devuelve el HTML de una tarjeta. `rapida: false` la deja como enlace simple (relacionados). */
export function cardHTML(p, { sizes = '(max-width: 700px) 46vw, (max-width: 1100px) 30vw, 22vw', rapida = true } = {}) {
  const d = descuento(p);
  const tallasPanel = p.tallas
    .map((t) => `<button class="card__size" type="button" data-talla="${t}">${t}</button>`)
    .join('');
  const visibles = p.tallas.slice(0, TALLAS_A_LA_VISTA);
  const resto = p.tallas.length - visibles.length;
  const chips = visibles
    .map((t) => `<button class="card__chip" type="button" data-talla="${t}" aria-pressed="false" aria-label="Talla ${t}${p.unidad}">${t}</button>`)
    .join('') + (resto > 0 ? `<button class="card__chip card__chip--mas" type="button" data-rapida aria-label="Ver las ${p.tallas.length} tallas">+${resto}</button>` : '');

  return `
    <article class="card${rapida ? ' has-rapida' : ''}" data-id="${p.id}" data-cat="${p.cat}" data-idx="${p.idx}">
      <div class="card__media">
        ${d ? `<span class="card__desc">-${d.porcentaje}%</span>` : ''}
        <span class="card__tag">${p.video ? '▶ Video 360°' : p.tag}</span>
        <img src="${p.srcSm}" srcset="${p.srcSm} 560w, ${p.src} 1000w" sizes="${sizes}"
             alt="${p.alt}" loading="lazy" decoding="async" width="560" height="560">
        <button class="card__ojo js-visor" type="button" data-id="${p.id}" aria-label="Ver fotos de ${p.name} en grande">${ojo}</button>
      </div>
      <div class="card__body">
        <p class="card__kicker mono">${p.marca && p.marca !== 'Otras' ? p.marca : p.tipo}</p>
        <h3 class="card__name">${p.name}</h3>
        <p class="card__meta">${p.color}</p>
        ${precioHTML(p)}
        ${rapida ? `
        <div class="card__chips" role="group" aria-label="Tallas${p.unidad ? ' US' : ''}">${chips}</div>
        <div class="card__acciones">
          <button class="card__ver js-quick" type="button" data-id="${p.id}">Ver producto</button>
          <button class="card__buy" type="button" data-agregar aria-label="Agregar ${p.name} al carrito">${bolsa} Agregar</button>
        </div>` : ''}
      </div>
      <button class="card__btn js-quick" type="button" data-id="${p.id}" aria-label="Ver ficha de ${p.name}, ${p.tag}"></button>
      ${rapida ? `
      <div class="card__rapida" role="group" aria-label="Elige tu talla de ${p.name}">
        <div class="card__rapida-top">
          <span class="mono">Elige tu talla${p.unidad ? ' (US)' : ''}</span>
          <button class="card__rapida-x" type="button" data-rapida-cerrar aria-label="Cerrar tallas">✕</button>
        </div>
        <div class="card__sizes">${tallasPanel}</div>
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
