/* Compra rápida desde la tarjeta: "Comprar" → tallas → al carrito en un toque.
   Se engancha una vez por contenedor (delegación), sirve para cualquier grilla. */

import { qs, qsa } from '../utils/dom.js';
import { porId, tienePrecio } from '../data/products.js';
import { wa, precioCOP } from '../data/site.js';
import { agregar, aviso } from './cart.js';

let escapeListo = false;

export function initCompraRapida(contenedor) {
  // Ojo: la marca de "ya enganchado" NO puede llamarse data-rapida, porque ese es
  // el selector del botón Comprar y closest() atraparía al contenedor entero.
  if (!contenedor || contenedor.dataset.compraRapidaLista === '1') return;
  contenedor.dataset.compraRapidaLista = '1';

  contenedor.addEventListener('click', (e) => {
    const abrir = e.target.closest('[data-rapida]');
    if (abrir) {
      e.preventDefault();
      const card = abrir.closest('.card');
      qsa('.card.is-buying').forEach((c) => { if (c !== card) c.classList.remove('is-buying'); });
      card.classList.toggle('is-buying');
      const primera = qs('.card__size', card);
      if (card.classList.contains('is-buying') && primera) primera.focus({ preventScroll: true });
      return;
    }

    const cerrar = e.target.closest('[data-rapida-cerrar]');
    if (cerrar) {
      cerrar.closest('.card').classList.remove('is-buying');
      return;
    }

    const talla = e.target.closest('.card__size');
    if (!talla) return;
    const card = talla.closest('.card');
    const p = porId(card.dataset.id);
    if (!p) return;
    qsa('.card__size', card).forEach((b) => b.classList.toggle('is-active', b === talla));
    agregar(p.id, talla.dataset.talla);
    aviso(p, talla.dataset.talla);
    const ya = qs('[data-pedir-ya]', card);
    if (ya) {
      const precio = tienePrecio(p) ? precioCOP(p.precio) : 'precio a confirmar';
      ya.href = wa(`Hola OGCLEAN, quiero comprar: ${p.name} (${p.tag}) talla ${talla.dataset.talla}${p.unidad} — ${precio}.`);
      ya.hidden = false;
    }
  });

  if (!escapeListo) {
    escapeListo = true;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') qsa('.card.is-buying').forEach((c) => c.classList.remove('is-buying'));
    });
  }
}
