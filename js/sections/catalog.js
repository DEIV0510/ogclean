/* Catálogo con pestañas (gorras / zapatillas), filtros por marca, búsqueda,
   paginación "Ver más" y compra rápida con talla desde la tarjeta. */

import { qs, qsa } from '../utils/dom.js';
import { LINEAS, porId, tienePrecio } from '../data/products.js';
import { renderCards } from '../components/productCard.js';
import { agregar, aviso } from '../components/cart.js';
import { wa, precioCOP } from '../data/site.js';
import { initReveals } from '../utils/motion.js';

const POR_PAGINA = 24;

let lineaActual = 'caps';
let filtroActual = 'all';
let busqueda = '';
let visibles = POR_PAGINA;

/* Minúsculas y sin tildes para que "cafe" encuentre "Café" */
const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function resultados() {
  // Cada palabra debe aparecer, en cualquier orden: "bape azul" encuentra "BAPE Road Sta · Azul marino"
  const palabras = normal(busqueda).split(/\s+/).filter(Boolean);
  return LINEAS[lineaActual].items.filter((p) => {
    if (filtroActual !== 'all' && p.cat !== filtroActual) return false;
    if (!palabras.length) return true;
    const texto = normal(`${p.name} ${p.tag} ${p.color} ${p.marca || ''} ${p.tipo}`);
    return palabras.every((w) => texto.includes(w));
  });
}

function pintarFiltros(cont) {
  cont.innerHTML = LINEAS[lineaActual].filtros
    .map((f) => `
      <button class="chip${f.id === filtroActual ? ' is-active' : ''}" type="button" data-filtro="${f.id}" aria-pressed="${f.id === filtroActual}">
        ${f.label}${f.n ? ` <span class="chip__n">${f.n}</span>` : ''}
      </button>`)
    .join('');
}

function pintar(refs, { conReveal = true } = {}) {
  const linea = LINEAS[lineaActual];
  const lista = resultados();
  const pagina = lista.slice(0, visibles);

  renderCards(refs.grid, pagina);
  if (conReveal) initReveals(refs.grid);

  const n = lista.length;
  const precios = linea.items.some((p) => !tienePrecio(p))
    ? 'Precios por WhatsApp o en la ficha'
    : precioCOP(linea.items[0].precio);
  refs.count.textContent = `${n} ${n === 1 ? linea.singular : linea.plural} · ${precios}`;

  refs.vacio.hidden = n > 0;
  refs.mas.hidden = visibles >= n;
  refs.masTexto.textContent = `Ver más (${n - pagina.length} restantes)`;
}

/* ---------- Compra rápida desde la tarjeta ---------- */

function initCompraRapida(grid) {
  grid.addEventListener('click', (e) => {
    const abrir = e.target.closest('[data-rapida]');
    if (abrir) {
      e.preventDefault();
      const card = abrir.closest('.card');
      qsa('.card.is-buying', grid).forEach((c) => { if (c !== card) c.classList.remove('is-buying'); });
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
    if (talla) {
      const card = talla.closest('.card');
      const p = porId(card.dataset.id);
      if (!p) return;
      qsa('.card__size', card).forEach((b) => b.classList.toggle('is-active', b === talla));
      agregar(p.id, talla.dataset.talla);
      aviso(p, talla.dataset.talla);
      const ya = qs('[data-pedir-ya]', card);
      if (ya) {
        ya.href = wa(`Hola OGCLEAN, quiero comprar: ${p.name} (${p.tag}) talla ${talla.dataset.talla}${p.unidad} — ${tienePrecio(p) ? precioCOP(p.precio) : 'precio a confirmar'}.`);
        ya.hidden = false;
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    qsa('.card.is-buying', grid).forEach((c) => c.classList.remove('is-buying'));
  });
}

export function initCatalog() {
  const refs = {
    grid: qs('#catalogoGrid'),
    count: qs('#catalogoCount'),
    filtros: qs('#catalogoFiltros'),
    buscar: qs('#catalogoBuscar'),
    vacio: qs('#catalogoVacio'),
    mas: qs('#catalogoMas'),
    masTexto: qs('#catalogoMas span'),
  };
  const tabs = qsa('.catalogo__tab');
  if (!refs.grid || !refs.filtros) return;

  // Conteos reales en las pestañas
  tabs.forEach((t) => {
    const n = qs('span', t);
    if (n && LINEAS[t.dataset.tab]) n.textContent = LINEAS[t.dataset.tab].items.length;
  });

  const reiniciar = () => { visibles = POR_PAGINA; };

  const cambiarLinea = (id) => {
    if (!LINEAS[id]) return;
    lineaActual = id;
    filtroActual = 'all';
    busqueda = '';
    if (refs.buscar) {
      refs.buscar.value = '';
      refs.buscar.placeholder = id === 'caps' ? 'Buscar equipo o color…' : 'Buscar marca, modelo o color…';
    }
    reiniciar();
    tabs.forEach((t) => {
      const activo = t.dataset.tab === id;
      t.classList.toggle('is-active', activo);
      t.setAttribute('aria-selected', String(activo));
    });
    refs.grid.setAttribute('aria-labelledby', `tab-${id}`);
    pintarFiltros(refs.filtros);
    pintar(refs);
  };

  tabs.forEach((t) => t.addEventListener('click', () => cambiarLinea(t.dataset.tab)));

  refs.filtros.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    filtroActual = chip.dataset.filtro;
    qsa('.chip', refs.filtros).forEach((c) => {
      const activo = c === chip;
      c.classList.toggle('is-active', activo);
      c.setAttribute('aria-pressed', String(activo));
    });
    reiniciar();
    pintar(refs);
  });

  if (refs.buscar) {
    let t = 0;
    refs.buscar.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        busqueda = refs.buscar.value;
        // Quien escribe busca en todo el catálogo, no solo en la marca marcada
        if (busqueda.trim() && filtroActual !== 'all') {
          filtroActual = 'all';
          pintarFiltros(refs.filtros);
        }
        reiniciar();
        pintar(refs, { conReveal: false });
      }, 160);
    });
  }

  refs.mas?.addEventListener('click', () => {
    const antes = visibles;
    visibles += POR_PAGINA;
    pintar(refs, { conReveal: false });
    // Lleva el foco a la primera tarjeta nueva (teclado / lector de pantalla)
    const nueva = qsa('.card', refs.grid)[antes];
    nueva?.querySelector('.card__buy')?.focus({ preventScroll: true });
  });

  // Los CTA de "Líneas" abren la pestaña correspondiente
  qsa('[data-tab]').forEach((el) => {
    if (el.classList.contains('catalogo__tab')) return;
    el.addEventListener('click', () => cambiarLinea(el.dataset.tab));
  });

  initCompraRapida(refs.grid);
  pintarFiltros(refs.filtros);
  pintar(refs);
}
