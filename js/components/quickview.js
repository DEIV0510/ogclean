/* Ficha de producto a pantalla completa: galería con zoom al punto exacto,
   selector de talla, especificaciones y salto directo a WhatsApp. */

import { qs, qsa } from '../utils/dom.js';
import { porId, LINEAS } from '../data/products.js';
import { SITE, wa, precioCOP } from '../data/site.js';
import { cardHTML } from './productCard.js';
import { agregar } from './cart.js';

const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.3-.6-2.1-1.1-3-2.5-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.5.5.2.9.4 1.3.5.5.2 1 .1 1.3-.1.4-.2 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z"/></svg>';

const bolsaIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6.5 8h11l-1 11.5a1.5 1.5 0 0 1-1.5 1.4H9a1.5 1.5 0 0 1-1.5-1.4L6.5 8Z" stroke-linejoin="round"/><path d="M9.5 8V6.6a2.5 2.5 0 0 1 5 0V8" stroke-linecap="round"/></svg>';

let modal, cuerpo, scroll, ultimoFoco = null;
let tallaElegida = '';

function relacionados(p) {
  return LINEAS[p.linea].items.filter((x) => x.id !== p.id).slice(0, 6);
}

function fichaHTML(p) {
  const tallas = p.tallas
    .map((t) => `<button class="size" type="button" data-talla="${t}">${t}${p.unidad}</button>`)
    .join('');

  return `
    <div class="quick__media" id="quickMedia">
      <img src="${p.src}" alt="${p.alt}" width="1000" height="1000" decoding="async">
      <span class="quick__hint">Clic para acercar</span>
    </div>

    <div class="quick__info">
      <p class="eyebrow">${p.tipo} · ${p.linea === 'caps' ? 'Talla cerrada' : 'Talla US'}</p>
      <h2 class="h2 quick__title">${p.name}</h2>
      <p class="lead">${p.tag}${p.color.toLowerCase() === p.tag.toLowerCase() ? '' : ` · ${p.color}`}. ${p.linea === 'caps' ? 'Fitted 59FIFTY, talla cerrada.' : 'Línea Nike Kyrie, talla US.'}</p>

      <p class="quick__price">${precioCOP(p.precio)} <small>Precio único de la línea</small></p>

      <div>
        <p class="mono" style="margin-bottom:.5rem">Elige tu talla</p>
        <div class="sizes" id="quickSizes" role="group" aria-label="Tallas disponibles">${tallas}</div>
      </div>

      <button class="btn btn--dark btn--lg btn--block" id="quickAdd" type="button">
        ${bolsaIcon} Agregar al carrito
      </button>
      <a class="btn btn--primary btn--lg btn--block" id="quickCta" href="#" target="_blank" rel="noopener">
        ${waIcon} Pedir solo esta pieza
      </a>
      <a class="link-line js-wa2" data-wa="Hola OGCLEAN, quiero preguntar por ${p.name} (${p.tag})." href="#">
        Escribir a la línea 2 <span aria-hidden="true">→</span>
      </a>

      <ul class="spec-list">
        <li><span class="k">Línea</span><span class="v">${p.linea === 'caps' ? 'Gorra fitted 59FIFTY' : 'Nike Kyrie'}</span></li>
        <li><span class="k">Referencia</span><span class="v">${p.tag}</span></li>
        <li><span class="k">Color</span><span class="v">${p.color}</span></li>
        <li><span class="k">Tallas</span><span class="v">${p.tallas[0]}${p.unidad} — ${p.tallas[p.tallas.length - 1]}${p.unidad}</span></li>
        <li><span class="k">Envío</span><span class="v">${SITE.envios}</span></li>
      </ul>
    </div>

    <section class="quick__related" aria-label="También te puede interesar">
      <h3 class="mono">También te puede interesar</h3>
      <div class="quick__related-track">
        ${relacionados(p).map((r) => cardHTML(r, { sizes: '(max-width: 860px) 42vw, 220px' })).join('')}
      </div>
    </section>`;
}

function mensaje(p) {
  const partes = [`Hola OGCLEAN, quiero comprar: ${p.name} (${p.tag}) — ${precioCOP(p.precio)}.`];
  if (tallaElegida) partes.push(`Talla: ${tallaElegida}${p.unidad}.`);
  return partes.join(' ');
}

function activarZoom() {
  const media = qs('#quickMedia');
  if (!media) return;
  const img = qs('img', media);

  media.addEventListener('click', (e) => {
    const abierto = media.classList.toggle('is-zoom');
    if (!abierto) { img.style.transformOrigin = 'center center'; return; }
    const r = media.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  });
}

export function abrirFicha(id) {
  const p = porId(id);
  if (!p || !modal) return;

  tallaElegida = '';
  cuerpo.innerHTML = fichaHTML(p);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  if (scroll) scroll.scrollTop = 0;

  const cta = qs('#quickCta');
  const sizes = qs('#quickSizes');
  const link2 = qs('.js-wa2', cuerpo);

  const refrescarCta = () => { if (cta) cta.href = wa(mensaje(p)); };
  refrescarCta();
  if (link2) link2.href = wa(link2.dataset.wa, SITE.whatsapp.linea2.numero);

  if (sizes) {
    sizes.addEventListener('click', (e) => {
      const b = e.target.closest('.size');
      if (!b) return;
      qsa('.size', sizes).forEach((s) => s.classList.remove('is-active'));
      b.classList.add('is-active');
      tallaElegida = b.dataset.talla;
      sizes.classList.remove('is-hint');
      refrescarCta();
    });
  }

  /** Sin talla no se compra: la señalamos en vez de dejar pasar el pedido. */
  const pedirTalla = () => {
    if (tallaElegida || !sizes) return false;
    sizes.classList.add('is-hint');
    sizes.scrollIntoView({ block: 'center', behavior: 'smooth' });
    setTimeout(() => sizes.classList.remove('is-hint'), 900);
    return true;
  };

  if (cta) {
    cta.addEventListener('click', (e) => { if (pedirTalla()) e.preventDefault(); });
  }

  const add = qs('#quickAdd');
  if (add) {
    add.addEventListener('click', () => {
      if (pedirTalla()) return;
      agregar(p.id, tallaElegida);
      const original = add.innerHTML;
      add.classList.add('is-added');
      add.innerHTML = '✓ Agregado al carrito';
      setTimeout(() => {
        add.classList.remove('is-added');
        add.innerHTML = original;
      }, 1400);
    });
  }

  activarZoom();
  qs('#quickClose')?.focus({ preventScroll: true });
}

export function cerrarFicha() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
  cuerpo.innerHTML = '';
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}

export function initQuickView() {
  modal = qs('#quick');
  cuerpo = qs('#quickBody');
  scroll = qs('#quickScroll');
  if (!modal) return;

  // Delegación global: cualquier .js-quick abre la ficha, incluso los relacionados
  document.addEventListener('click', (e) => {
    const disparador = e.target.closest('.js-quick');
    if (!disparador) return;
    e.preventDefault();
    if (!modal.classList.contains('is-open')) ultimoFoco = disparador;
    abrirFicha(disparador.dataset.id);
  });

  qs('#quickClose')?.addEventListener('click', cerrarFicha);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) cerrarFicha();
  });
}
