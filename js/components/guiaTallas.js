/* Guía de tallas del calzado: tabla nacional (Colombia) → Euro.
   La usan la ficha de cada zapato (desplegable «¿Cuál es mi talla?») y la
   sección #tallas del inicio, con los mismos datos (js/data/tallas.js). */

import { GUIA_TALLAS } from '../data/tallas.js';
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

/** Desplegable para la ficha de un par de calzado. */
export function guiaFichaHTML(p) {
  return `
    <details class="quick__guia">
      <summary>¿Cuál es mi talla? <span>Guía de tallas</span></summary>
      <div class="quick__guia-cuerpo">
        <p>Revisa la etiqueta de las zapatillas que ya usas y busca el número <b>EUR</b>: esa es tu talla. Si no la tienes, pasa tu talla nacional a Euro:</p>
        ${tablasTallasHTML(p.genero === 'dama' ? 'dama' : 'hombre')}
      </div>
    </details>`;
}

/** Rellena los contenedores [data-guia-tallas] de la página (sección del inicio). */
export function initGuiaTallas() {
  qsa('[data-guia-tallas]').forEach((el) => { el.innerHTML = tablasTallasHTML(); });
}
