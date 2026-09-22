/* ============================================================
   FIRMA OGCLEAN · "La órbita"
   El globo rojo del logo reducido a dos piezas: la ÓRBITA (curva de
   meridiano) y el PUNTO rojo. Aparece, con variaciones, en:
   hero (globo 3D) → uniones entre secciones (meridianos que se dibujan
   con el scroll) → tarjetas (arco al pasar el cursor) → carrito (el punto
   viaja en órbita al agregar) → cierre y tienda (el globo vuelve).
   Todo SVG/CSS con transform/opacity: barato para la GPU.
   ============================================================ */

import { qs, qsa, reducedMotion, finePointer, rafThrottle } from '../utils/dom.js';

let idGlobo = 0;

/** Globo del logo: meridianos + órbita inclinada con el punto rojo recorriéndola. */
function globoSVG({ orbita = true, velocidad = 16 } = {}) {
  idGlobo += 1;
  const id = `og-orbita-${idGlobo}`;
  const mov = reducedMotion ? '' : `<animateMotion dur="${velocidad}s" repeatCount="indefinite"><mpath href="#${id}"/></animateMotion>`;
  return `
    <svg class="globo" viewBox="-20 -20 240 240" fill="none" aria-hidden="true" focusable="false">
      <g class="globo__meridianos">
        <circle pathLength="1" cx="100" cy="100" r="98"/>
        <ellipse pathLength="1" cx="100" cy="100" rx="72" ry="98"/>
        <ellipse pathLength="1" cx="100" cy="100" rx="38" ry="98"/>
        <path pathLength="1" d="M2 100h196"/>
        <path pathLength="1" d="M14 58h172"/>
        <path pathLength="1" d="M14 142h172"/>
      </g>
      ${orbita ? `
      <path id="${id}" class="globo__orbita" pathLength="1"
            d="M-5.7 130.3 A 110 36 -16 1 1 205.7 69.7 A 110 36 -16 1 1 -5.7 130.3"/>
      <circle class="globo__punto" r="4.5" cx="0" cy="0" ${reducedMotion ? 'transform="translate(205.7 69.7)"' : ''}>${mov}</circle>` : ''}
    </svg>`;
}

/* ---------------- Globos ---------------- */

function initGlobos() {
  qsa('[data-globo]').forEach((el) => {
    el.innerHTML = globoSVG({ orbita: el.dataset.globo !== 'sin-orbita', velocidad: Number(el.dataset.velocidad) || 16 });
    // Los meridianos se dibujan cuando el globo entra en pantalla
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-dibujado');
        io.unobserve(e.target);
      });
    }, { threshold: 0.2 });
    io.observe(el);
  });
}

/** El globo del hero se inclina en 3D siguiendo el cursor (con inercia). */
function initGloboHero() {
  const hero = qs('.hero');
  const globo = qs('.hero [data-globo]');
  if (!hero || !globo || reducedMotion) return;

  let objX = 0, objY = 0, x = 0, y = 0, activo = false;
  const paso = () => {
    x += (objX - x) * 0.08;
    y += (objY - y) * 0.08;
    globo.style.setProperty('--gx', `${x.toFixed(2)}deg`);
    globo.style.setProperty('--gy', `${y.toFixed(2)}deg`);
    if (Math.abs(objX - x) > 0.05 || Math.abs(objY - y) > 0.05) requestAnimationFrame(paso);
    else activo = false;
  };
  const mover = (nx, ny) => {
    objY = nx * 22;   // izquierda/derecha → giro en Y
    objX = -ny * 16;  // arriba/abajo → giro en X
    if (!activo) { activo = true; requestAnimationFrame(paso); }
  };

  if (finePointer) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      mover((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
    });
    hero.addEventListener('pointerleave', () => mover(0, 0));
  } else {
    // En táctil el globo responde al scroll, sin sensores ni permisos
    const alScroll = rafThrottle(() => {
      const p = Math.min(window.scrollY / window.innerHeight, 1);
      mover(0.35 - p * 0.7, p * 0.6);
    });
    window.addEventListener('scroll', alScroll, { passive: true });
    alScroll();
  }
}

/* ---------------- Meridianos entre secciones ---------------- */

function initMeridianos() {
  const lista = qsa('.meridiano').map((el) => ({
    el,
    linea: qs('.meridiano__linea', el),
    punto: qs('.meridiano__punto', el),
    svg: qs('svg', el),
  })).filter((m) => m.linea);
  if (!lista.length) return;

  const pintar = rafThrottle(() => {
    const vh = window.innerHeight;
    lista.forEach((m) => {
      const r = m.el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      // 0 cuando asoma por abajo, 1 cuando llega al 35% superior
      const p = reducedMotion ? 1 : Math.min(Math.max((vh - r.top) / (vh * 0.75), 0), 1);
      m.linea.style.strokeDashoffset = (1 - p).toFixed(4);
      if (m.punto) {
        const largo = m.linea.getTotalLength();
        const pt = m.linea.getPointAtLength(largo * p);
        const vb = m.svg.viewBox.baseVal;
        const px = (pt.x - vb.x) * (r.width / vb.width);
        const py = (pt.y - vb.y) * (r.height / vb.height);
        m.punto.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) scale(${p > 0.02 ? 1 : 0})`;
      }
    });
  });

  pintar();
  window.addEventListener('scroll', pintar, { passive: true });
  window.addEventListener('resize', pintar);
}

/* ---------------- Tarjetas: halo que sigue al cursor ---------------- */

function initTarjetas() {
  if (finePointer && !reducedMotion) {
    let media = null, ex = 0, ey = 0;
    const aplicar = rafThrottle(() => {
      if (!media) return;
      const r = media.getBoundingClientRect();
      const nx = (ex - r.left) / r.width;
      const ny = (ey - r.top) / r.height;
      media.style.setProperty('--mx', `${(nx * 100).toFixed(1)}%`);
      media.style.setProperty('--my', `${(ny * 100).toFixed(1)}%`);
      media.style.setProperty('--tx', `${((nx - 0.5) * -10).toFixed(1)}px`);
      media.style.setProperty('--ty', `${((ny - 0.5) * -10).toFixed(1)}px`);
    });
    document.addEventListener('pointermove', (e) => {
      const m = e.target.closest?.('.card__media');
      if (m !== media && media) {
        media.style.removeProperty('--tx');
        media.style.removeProperty('--ty');
      }
      media = m;
      ex = e.clientX; ey = e.clientY;
      if (media) aplicar();
    }, { passive: true });
  }

  // Táctil (y sin hover): el arco de la órbita barre la tarjeta una vez al aparecer
  if (!finePointer) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-orbita');
        io.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    const observar = () => qsa('.card:not([data-orbita])').forEach((c) => { c.dataset.orbita = '1'; io.observe(c); });
    observar();
    // Las grillas se repintan al filtrar: observar las tarjetas nuevas
    new MutationObserver(rafThrottle(observar)).observe(document.body, { childList: true, subtree: true });
  }
}

/* ---------------- WOW: el punto viaja en órbita al carrito ---------------- */

let ultimoToque = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function destinoCarrito() {
  const visibles = [qs('#cartBtn'), qs('.mobile-bar.is-visible .js-cart-open')].filter(Boolean)
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width && r.top >= 0 && r.bottom <= window.innerHeight);
  return (visibles[0] || { el: qs('#cartBtn'), r: qs('#cartBtn')?.getBoundingClientRect() });
}

export function volarAlCarrito() {
  if (reducedMotion) return;
  // Si el header está escondido por el scroll, se asoma para recibir el punto
  const header = qs('#header');
  if (header?.classList.contains('is-hidden') && !qs('.mobile-bar.is-visible')) {
    header.classList.remove('is-hidden');
    setTimeout(volarAlCarrito, 260);
    return;
  }
  const destino = destinoCarrito();
  if (!destino.r) return;
  const a = ultimoToque;
  const b = { x: destino.r.left + destino.r.width / 2, y: destino.r.top + destino.r.height / 2 };
  // Curva de órbita: se eleva por encima del recorrido recto, como un meridiano
  const c = { x: (a.x + b.x) / 2 + (b.y - a.y) * 0.25, y: Math.min(a.y, b.y) - Math.max(120, Math.abs(b.x - a.x) * 0.35) };

  const punto = document.createElement('span');
  punto.className = 'og-vuelo';
  document.body.appendChild(punto);

  const pasos = 18;
  const frames = [];
  for (let i = 0; i <= pasos; i++) {
    const t = i / pasos;
    const x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t ** 2 * b.x;
    const y = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t ** 2 * b.y;
    const s = 1 + Math.sin(t * Math.PI) * 0.6 - t * 0.5;
    frames.push({ transform: `translate3d(${x}px, ${y}px, 0) scale(${s.toFixed(2)})`, opacity: i === pasos ? 0.2 : 1 });
  }
  const anim = punto.animate(frames, { duration: 760, easing: 'cubic-bezier(.45,.05,.3,1)' });
  anim.onfinish = () => {
    punto.remove();
    destino.el?.classList.remove('is-recibe');
    void destino.el?.offsetWidth;
    destino.el?.classList.add('is-recibe');
  };
}

/* ---------------- Arranque ---------------- */

export function initFirma() {
  document.addEventListener('pointerdown', (e) => { ultimoToque = { x: e.clientX, y: e.clientY }; }, { passive: true, capture: true });
  document.addEventListener('og:agregado', volarAlCarrito);
  initGlobos();
  initGloboHero();
  initMeridianos();
  initTarjetas();
}
