/* Favoritos: un corazón en la tarjeta y en la ficha para marcar productos que
   alguien no compra ya pero quiere tener ahí pendiente. Sin panel ni contador
   aparte (así lo pidió el dueño) — solo el estado guardado en el navegador. */

import { qsa, rafThrottle } from '../utils/dom.js';

const CLAVE = 'ogclean:favoritos:v1';

function leer() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) || '[]');
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardar(lista) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    /* localStorage no disponible (privado/bloqueado): el corazón deja de recordar, no rompe nada */
  }
}

export function esFavorito(id) {
  return leer().includes(id);
}

/** Marca/desmarca un producto. Devuelve el nuevo estado (true = guardado). */
export function alternarFavorito(id) {
  const lista = leer();
  const i = lista.indexOf(id);
  const activo = i === -1;
  if (activo) lista.push(id);
  else lista.splice(i, 1);
  guardar(lista);
  return activo;
}

function pintar(btn) {
  const activo = esFavorito(btn.dataset.id);
  btn.classList.toggle('is-activo', activo);
  btn.setAttribute('aria-pressed', String(activo));
  btn.setAttribute('aria-label', activo ? 'Quitar de favoritos' : 'Guardar en favoritos');
}

const pintarTodos = () => qsa('.js-favorito').forEach(pintar);

export function initFavoritos() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-favorito');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation(); // no abrir la ficha del producto al tocar el corazón
    const activo = alternarFavorito(btn.dataset.id);
    qsa(`.js-favorito[data-id="${btn.dataset.id}"]`).forEach((b) => {
      b.classList.toggle('is-activo', activo);
      b.setAttribute('aria-pressed', String(activo));
      b.setAttribute('aria-label', activo ? 'Quitar de favoritos' : 'Guardar en favoritos');
    });
    btn.classList.add('is-pop');
    setTimeout(() => btn.classList.remove('is-pop'), 260);
  });

  // Las tarjetas se repintan al filtrar/paginar/abrir la ficha: repintar corazones nuevos
  pintarTodos();
  new MutationObserver(rafThrottle(pintarTodos)).observe(document.body, { childList: true, subtree: true });
}
