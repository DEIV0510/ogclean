/* Guías de tallas: calzado (talla nacional de Colombia → Euro) y gorras cerradas
   (contorno de la cabeza en cm → talla 59FIFTY). Las usan la ficha de cada producto
   (desplegable «¿Cuál es mi talla?» / «¿Cómo saber tu talla?») y la sección #tallas
   del inicio, con los mismos datos (js/data/tallas.js). */

import { GUIA_TALLAS, GUIA_GORRAS, PASOS_GORRAS } from '../data/tallas.js';
import { qsa } from '../utils/dom.js';

/** Tablas Caballero y Dama; `resaltar` ('hombre' | 'dama') marca la del producto abierto. */
export function tablasTallasHTML(resaltar = '') {
  return `<div class="guia-tallas">${GUIA_TALLAS.map((g) => `
    <table class="guia-tallas__tabla${g.id === resaltar ? ' is-actual' : ''}">
      <caption>${g.titulo}</caption>
      <thead><tr><th scope="col">Nacional</th><th scope="col">Euro</th></tr></thead>
      <tbody>${g.filas.map(([nacional, euro]) => `<tr><td>${nacional}</td><td>${euro}</td></tr>`).join('')}</tbody>
    </table>`).join('')}</div>`;
}

/** Tabla de gorras cerradas: contorno de la cabeza → talla. `tallas` limita a las de un producto. */
export function tablaGorrasHTML(tallas = null) {
  return `
    <table class="guia-tallas__tabla guia-gorras__tabla">
      <caption>Gorras cerradas</caption>
      <thead><tr><th scope="col">Tu cabeza</th><th scope="col">Talla</th></tr></thead>
      <tbody>${GUIA_GORRAS.map(([talla, cm]) => `
        <tr${tallas && !tallas.includes(talla) ? ' class="is-agotada"' : ''}><td>${cm} cm</td><td>${talla}</td></tr>`).join('')}</tbody>
    </table>`;
}

const pasosGorrasHTML = () => `<ol class="guia-gorras__pasos">${PASOS_GORRAS.map((t) => `<li>${t}</li>`).join('')}</ol>`;

/** Desplegable para la ficha de un par de calzado. Unisex: las dos tablas por igual. */
export function guiaFichaHTML(p) {
  const unisex = p.genero === 'unisex';
  return `
    <details class="quick__guia">
      <summary>¿Cuál es mi talla? <span>Guía de tallas</span></summary>
      <div class="quick__guia-cuerpo">
        <p>Revisa la etiqueta de las zapatillas que ya usas y busca el número <b>EUR</b>: esa es tu talla. Si no la tienes, pasa tu talla nacional a Euro:</p>
        ${unisex ? '<p><b>Este par es unisex:</b> viene de la 36 a la 44, usa la tabla de caballero o la de dama.</p>' : ''}
        ${tablasTallasHTML(unisex ? '' : p.genero === 'dama' ? 'dama' : 'hombre')}
      </div>
    </details>`;
}

/** Desplegable para la ficha de una gorra cerrada (las ajustables son talla única). */
export function guiaGorraHTML(p) {
  return `
    <details class="quick__guia">
      <summary>¿Cómo saber tu talla? <span>Guía de tallas</span></summary>
      <div class="quick__guia-cuerpo">
        ${pasosGorrasHTML()}
        ${tablaGorrasHTML(p.tallas)}
        <p>En gris, las tallas que no hay de esta gorra.</p>
      </div>
    </details>`;
}

/** Rellena las tablas de la sección del inicio: [data-guia-tallas] (calzado) y [data-guia-gorras]. */
export function initGuiaTallas() {
  qsa('[data-guia-tallas]').forEach((el) => { el.innerHTML = tablasTallasHTML(); });
  qsa('[data-guia-gorras]').forEach((el) => { el.innerHTML = `<div class="guia-tallas guia-tallas--una">${tablaGorrasHTML()}</div>`; });
  qsa('[data-pasos-gorras]').forEach((el) => { el.innerHTML = PASOS_GORRAS.map((t, i) => `<li><b>0${i + 1}</b><span>${t}</span></li>`).join(''); });
}
