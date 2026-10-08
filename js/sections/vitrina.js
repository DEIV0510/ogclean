/* Vitrina de la cabecera de la tienda: fotos de estudio con fondo oscuro que se turnan
   detrás del título (lado derecho). Pedido del dueño (video del 3 de octubre): «meterle
   algo bien brutal a ese fondo, como una zapatilla, una gorra o modelos». Es solo fondo:
   sin enlace ni pie (dueño, 6-oct: «la idea es que la gente siga scrolleando»). Si no
   carga, la cabecera queda como antes. */

import { qs, reducedMotion } from '../utils/dom.js';
import { porId } from '../data/products.js';

// Fotos con fondo oscuro (se funden con la cabecera negra) y dónde queda el producto en cada una.
// La gorra (dueño, 7-oct: «que también se vea una gorra») usa una versión propia: el frente de
// su foto original, oscurecido y fundido a negro por la izquierda (las fotos de gorras son collages).
const VITRINA = [
  { id: 'sneakers-air-jordan-4-rojo-negro-blanco', pos: '50% 36%' },
  { id: 'caps-new-york-yankees-rojo-dragon', pos: '72% 45%', src: 'assets/img/gorras/new-york-yankees-rojo-dragon-vitrina.webp', srcSm: 'assets/img/gorras/new-york-yankees-rojo-dragon-vitrina-sm.webp' },
  { id: 'sneakers-air-jordan-14-amarillo-morado', pos: '50% 38%' },
  { id: 'sneakers-air-jordan-4-celeste-negro-gris', pos: '50% 40%' },
  { id: 'sneakers-air-jordan-9-blanco-azul-charol-amarillo', pos: '50% 34%' },
  { id: 'sneakers-air-jordan-14-rojo-negro-blanco', pos: '50% 38%' },
];
const CADA = 6000;

export function initVitrina() {
  const caja = qs('#tiendaVitrina');
  if (!caja || navigator.connection?.saveData) return;

  const slides = VITRINA
    .map((v) => ({ ...v, p: porId(v.id) }))
    .filter((v) => v.p)
    .map(({ p, pos, src = p.src, srcSm = p.srcSm }) => {
      const fig = document.createElement('figure');
      fig.className = 'vitrina__slide';
      const img = document.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      img.setAttribute('fetchpriority', 'low');
      img.style.objectPosition = pos;
      // En celular la foto va atenuada detrás del título: basta la versión de 560 px
      img.sizes = '(max-width: 700px) 180px, 64vw';
      fig.append(img);
      caja.append(fig);
      return { fig, img, src, srcSm, listo: null };
    });
  if (!slides.length) return;

  // Cada foto se pide justo antes de su turno, nunca todas de golpe
  const cargar = (s) => (s.listo ||= new Promise((ok) => {
    s.img.onload = s.img.onerror = () => ok();
    s.img.srcset = `${s.srcSm} 560w, ${s.src} 1000w`;
    s.img.src = s.src;
  }));

  let i = 0;
  let timer = 0;
  let visible = true;
  const mostrar = (n) => {
    slides.forEach((s, k) => s.fig.classList.toggle('is-on', k === n));
    if (slides.length > 1) cargar(slides[(n + 1) % slides.length]);
  };
  const programar = () => {
    clearTimeout(timer);
    if (reducedMotion || slides.length < 2 || !visible || document.hidden) return;
    timer = setTimeout(async () => {
      const n = (i + 1) % slides.length;
      await cargar(slides[n]);
      i = n;
      mostrar(i);
      programar();
    }, CADA);
  };

  cargar(slides[0]).then(() => {
    caja.classList.add('is-lista');
    mostrar(0);
    programar();
  });

  document.addEventListener('visibilitychange', programar);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; programar(); }).observe(caja);
  }
}
