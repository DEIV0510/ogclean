/* Fila deslizable con flechas: envuelve un contenedor con scroll horizontal y le
   pone botones ‹ › en los bordes. Cada flecha (y su degradado) aparece solo si hay
   más contenido hacia ese lado, así se nota que la fila sigue. La usan las
   categorías de la tienda y las miniaturas del combo. */

import { rafThrottle, reducedMotion } from '../utils/dom.js';

const flechaSVG = (dir) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="${dir === 'izq' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5'}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/**
 * @param {HTMLElement} pista  contenedor con overflow-x
 * @param {{ etiqueta?: string, sangrado?: boolean }} opciones
 *   etiqueta: qué se recorre, para el nombre accesible de las flechas ("categorías", "gorras"…)
 *   sangrado: la pista se sale del contenedor hasta el borde de la pantalla (margen negativo)
 */
export function initFila(pista, { etiqueta = 'opciones', sangrado = false } = {}) {
  if (!pista || pista.parentElement?.classList.contains('fila')) return null;

  const fila = document.createElement('div');
  fila.className = `fila${sangrado ? ' fila--sangrado' : ''}`;
  pista.before(fila);
  fila.append(pista);
  pista.classList.add('fila__pista');

  const [izq, der] = ['izq', 'der'].map((dir) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `fila__flecha fila__flecha--${dir}`;
    b.setAttribute('aria-label', dir === 'izq' ? `Ver ${etiqueta} anteriores` : `Ver más ${etiqueta}`);
    b.innerHTML = flechaSVG(dir);
    b.addEventListener('click', () => {
      const paso = Math.max(pista.clientWidth * 0.8, 140);
      pista.scrollBy({ left: dir === 'izq' ? -paso : paso, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    fila.append(b);
    return b;
  });

  const actualizar = () => {
    const max = pista.scrollWidth - pista.clientWidth;
    const hayIzq = pista.scrollLeft > 2;
    const hayDer = pista.scrollLeft < max - 2;
    izq.classList.toggle('is-on', hayIzq);
    der.classList.toggle('is-on', hayDer);
    fila.classList.toggle('hay-izq', hayIzq);
    fila.classList.toggle('hay-der', hayDer);
  };

  const tick = rafThrottle(actualizar);
  pista.addEventListener('scroll', tick, { passive: true });
  // Cambia el ancho (giro del celular) o se repinta el contenido (filtros, otra categoría)
  if ('ResizeObserver' in window) new ResizeObserver(tick).observe(pista);
  new MutationObserver(tick).observe(pista, { childList: true });
  actualizar();
  return { actualizar };
}
