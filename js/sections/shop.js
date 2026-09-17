/* Tienda: todos los productos con filtros combinables (categoría, marca,
   colección, color, precio), búsqueda, orden, paginación y URL compartible. */

import { qs, qsa } from '../utils/dom.js';
import { TODOS, ORDEN_COLORES, tienePrecio } from '../data/products.js';
import { renderCards } from '../components/productCard.js';
import { initCompraRapida } from '../components/compraRapida.js';

const POR_PAGINA = 24;
const GRUPOS = ['Gorras', 'Zapatillas', 'Botas'];

/* Estado de filtros. Los conjuntos permiten marcar varias opciones a la vez. */
const estado = {
  q: '',
  grupo: 'todo',
  marcas: new Set(),
  colecciones: new Set(),
  colores: new Set(),
  precio: 'todos', // todos | con | cotizar
  orden: 'destacados',
  visibles: POR_PAGINA,
};

const normal = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const etiquetaMarca = (m) => (m === 'Otras' ? 'Otras (sin marca)' : m);

let refs = {};

/* ---------------- Filtrado ---------------- */

/** Aplica todos los filtros menos `ignorar` (sirve para contar opciones de esa faceta). */
function filtrar(ignorar = '') {
  const palabras = normal(estado.q).split(/\s+/).filter(Boolean);
  return TODOS.filter((p) => {
    if (ignorar !== 'grupo' && estado.grupo !== 'todo' && p.grupo !== estado.grupo) return false;
    if (ignorar !== 'marcas' && estado.marcas.size && !estado.marcas.has(p.marca)) return false;
    if (ignorar !== 'colecciones' && estado.colecciones.size && !estado.colecciones.has(p.coleccion)) return false;
    if (ignorar !== 'colores' && estado.colores.size && !p.colores.some((c) => estado.colores.has(c))) return false;
    if (ignorar !== 'precio') {
      if (estado.precio === 'con' && !tienePrecio(p)) return false;
      if (estado.precio === 'cotizar' && tienePrecio(p)) return false;
    }
    if (palabras.length) {
      const texto = normal(`${p.name} ${p.tag} ${p.color} ${p.marca} ${p.grupo} ${p.coleccion || ''}`);
      if (!palabras.every((w) => texto.includes(w))) return false;
    }
    return true;
  });
}

function ordenar(lista) {
  const copia = [...lista];
  const nombre = (a, b) => a.name.localeCompare(b.name, 'es') || a.tag.localeCompare(b.tag, 'es');
  if (estado.orden === 'az') copia.sort(nombre);
  if (estado.orden === 'za') copia.sort((a, b) => nombre(b, a));
  if (estado.orden === 'precio') {
    // Con precio primero (de menor a mayor); lo que se cotiza, al final
    copia.sort((a, b) => {
      const pa = tienePrecio(a) ? a.precio : Infinity;
      const pb = tienePrecio(b) ? b.precio : Infinity;
      return pa - pb || nombre(a, b);
    });
  }
  return copia;
}

const contar = (lista, clave) => lista.reduce((acc, p) => {
  const valores = Array.isArray(p[clave]) ? p[clave] : [p[clave]];
  valores.filter(Boolean).forEach((v) => { acc[v] = (acc[v] || 0) + 1; });
  return acc;
}, {});

/* ---------------- Pintado de filtros ---------------- */

function opcionCheck(nombre, valor, label, n, marcado) {
  const id = `f-${nombre}-${normal(valor).replace(/[^a-z0-9]+/g, '-')}`;
  return `
    <label class="filtro-op${n ? '' : ' is-cero'}" for="${id}">
      <input type="checkbox" id="${id}" name="${nombre}" value="${valor}"${marcado ? ' checked' : ''}${!n && !marcado ? ' disabled' : ''}>
      <span class="filtro-op__caja" aria-hidden="true"></span>
      <span class="filtro-op__txt">${label}</span>
      <span class="filtro-op__n">${n}</span>
    </label>`;
}

function pintarFiltros() {
  // Categorías (pestañas grandes arriba)
  const porGrupo = contar(filtrar('grupo'), 'grupo');
  const totalGrupo = Object.values(porGrupo).reduce((a, b) => a + b, 0);
  refs.grupos.innerHTML = [['todo', 'Todo', totalGrupo], ...GRUPOS.map((g) => [g, g, porGrupo[g] || 0])]
    .map(([id, label, n]) => `
      <button class="tienda-cat${estado.grupo === id ? ' is-active' : ''}" type="button" data-grupo="${id}" aria-pressed="${estado.grupo === id}">
        ${label} <span>${n}</span>
      </button>`)
    .join('');

  // Marcas, ordenadas por cantidad
  const porMarca = contar(filtrar('marcas'), 'marca');
  const marcas = [...new Set(TODOS.map((p) => p.marca))]
    .filter((m) => porMarca[m] || estado.marcas.has(m))
    .sort((a, b) => (a === 'Otras') - (b === 'Otras') || (porMarca[b] || 0) - (porMarca[a] || 0) || a.localeCompare(b));
  refs.marcas.innerHTML = marcas.map((m) => opcionCheck('marca', m, etiquetaMarca(m), porMarca[m] || 0, estado.marcas.has(m))).join('');
  refs.marcasBloque.hidden = !marcas.length;

  // Colección (solo aplica a gorras)
  const porColeccion = contar(filtrar('colecciones'), 'coleccion');
  const colecciones = ['MLB', 'World Baseball Classic'].filter((c) => porColeccion[c] || estado.colecciones.has(c));
  refs.colecciones.innerHTML = colecciones.map((c) => opcionCheck('coleccion', c, c, porColeccion[c] || 0, estado.colecciones.has(c))).join('');
  refs.coleccionesBloque.hidden = !colecciones.length;

  // Colores como muestras
  const porColor = contar(filtrar('colores'), 'colores');
  refs.colores.innerHTML = ORDEN_COLORES
    .filter((c) => porColor[c] || estado.colores.has(c))
    .map((c) => {
      const activo = estado.colores.has(c);
      const clase = normal(c).replace(/[^a-z]+/g, '-');
      return `
        <button class="filtro-color${activo ? ' is-active' : ''}" type="button" data-color="${c}" aria-pressed="${activo}">
          <span class="filtro-color__muestra filtro-color__muestra--${clase}" aria-hidden="true"></span>
          <span>${c}</span><span class="filtro-op__n">${porColor[c] || 0}</span>
        </button>`;
    })
    .join('');

  // Precio
  const basePrecio = filtrar('precio');
  const con = basePrecio.filter(tienePrecio).length;
  refs.precio.innerHTML = [['todos', 'Todos', basePrecio.length], ['con', 'Con precio publicado', con], ['cotizar', 'Precio por WhatsApp', basePrecio.length - con]]
    .map(([id, label, n]) => `
      <label class="filtro-op filtro-op--radio${n || estado.precio === id ? '' : ' is-cero'}">
        <input type="radio" name="precio" value="${id}"${estado.precio === id ? ' checked' : ''}${!n && estado.precio !== id ? ' disabled' : ''}>
        <span class="filtro-op__caja" aria-hidden="true"></span>
        <span class="filtro-op__txt">${label}</span>
        <span class="filtro-op__n">${n}</span>
      </label>`)
    .join('');
}

/* ---------------- Resultados ---------------- */

function chipsActivos() {
  const chips = [];
  if (estado.q.trim()) chips.push(['q', estado.q.trim(), `“${estado.q.trim()}”`]);
  if (estado.grupo !== 'todo') chips.push(['grupo', estado.grupo, estado.grupo]);
  estado.marcas.forEach((m) => chips.push(['marca', m, etiquetaMarca(m)]));
  estado.colecciones.forEach((c) => chips.push(['coleccion', c, c]));
  estado.colores.forEach((c) => chips.push(['color', c, c]));
  if (estado.precio !== 'todos') chips.push(['precio', estado.precio, estado.precio === 'con' ? 'Con precio' : 'Precio por WhatsApp']);
  return chips;
}

function pintarResultados({ mantenerScroll = false } = {}) {
  const lista = ordenar(filtrar());
  const pagina = lista.slice(0, estado.visibles);

  renderCards(refs.grid, pagina, { sizes: '(max-width: 620px) 46vw, (max-width: 1100px) 30vw, 260px' });

  const n = lista.length;
  refs.total.textContent = n;
  refs.resumen.textContent = n
    ? `Mostrando ${pagina.length} de ${n} ${n === 1 ? 'producto' : 'productos'}`
    : 'Sin resultados';
  refs.vacio.hidden = n > 0;
  refs.mas.hidden = estado.visibles >= n;
  refs.masTexto.textContent = `Ver más productos (${n - pagina.length})`;

  const chips = chipsActivos();
  refs.activos.innerHTML = chips.map(([tipo, valor, label]) => `
    <button class="filtro-activo" type="button" data-quitar="${tipo}" data-valor="${valor}" aria-label="Quitar filtro ${label}">
      ${label} <span aria-hidden="true">✕</span>
    </button>`).join('') + (chips.length ? '<button class="filtro-limpiar" type="button" data-limpiar>Limpiar todo</button>' : '');
  refs.activosBloque.hidden = !chips.length;

  // Contador del botón "Filtros" en móvil
  const cuantos = chips.filter(([t]) => t !== 'q').length;
  refs.contadorMovil.textContent = cuantos ? `(${cuantos})` : '';
  refs.verResultados.textContent = `Ver ${n} ${n === 1 ? 'resultado' : 'resultados'}`;

  pintarFiltros();
  guardarEnUrl();

  if (!mantenerScroll && refs.inicioResultados.getBoundingClientRect().top < 0) {
    refs.inicioResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ---------------- URL (enlaces compartibles y atrás/adelante) ---------------- */

function guardarEnUrl() {
  const u = new URLSearchParams();
  if (estado.q.trim()) u.set('q', estado.q.trim());
  if (estado.grupo !== 'todo') u.set('categoria', estado.grupo);
  if (estado.marcas.size) u.set('marca', [...estado.marcas].join(','));
  if (estado.colecciones.size) u.set('coleccion', [...estado.colecciones].join(','));
  if (estado.colores.size) u.set('color', [...estado.colores].join(','));
  if (estado.precio !== 'todos') u.set('precio', estado.precio);
  if (estado.orden !== 'destacados') u.set('orden', estado.orden);
  const qs2 = u.toString();
  history.replaceState(null, '', `${location.pathname}${qs2 ? `?${qs2}` : ''}`);
}

function leerUrl() {
  const u = new URLSearchParams(location.search);
  const lista = (k) => (u.get(k) || '').split(',').map((s) => s.trim()).filter(Boolean);
  estado.q = u.get('q') || '';
  const cat = u.get('categoria');
  estado.grupo = GRUPOS.includes(cat) ? cat : 'todo';
  const marcas = new Set(TODOS.map((p) => p.marca));
  estado.marcas = new Set(lista('marca').filter((m) => marcas.has(m)));
  estado.colecciones = new Set(lista('coleccion').filter((c) => ['MLB', 'World Baseball Classic'].includes(c)));
  estado.colores = new Set(lista('color').filter((c) => ORDEN_COLORES.includes(c)));
  estado.precio = ['con', 'cotizar'].includes(u.get('precio')) ? u.get('precio') : 'todos';
  estado.orden = ['az', 'za', 'precio'].includes(u.get('orden')) ? u.get('orden') : 'destacados';
}

/* ---------------- Panel de filtros en móvil ---------------- */

function abrirPanel() {
  refs.panel.classList.add('is-open');
  refs.fondo.hidden = false;
  document.body.classList.add('is-locked');
  refs.botonFiltros.setAttribute('aria-expanded', 'true');
  qs('.tienda-filtros__cerrar', refs.panel)?.focus({ preventScroll: true });
}

function cerrarPanel() {
  refs.panel.classList.remove('is-open');
  refs.fondo.hidden = true;
  document.body.classList.remove('is-locked');
  refs.botonFiltros.setAttribute('aria-expanded', 'false');
}

/* ---------------- Arranque ---------------- */

export function initShop() {
  refs = {
    grid: qs('#tiendaGrid'),
    grupos: qs('#tiendaGrupos'),
    marcas: qs('#filtroMarcas'),
    marcasBloque: qs('#bloqueMarcas'),
    colecciones: qs('#filtroColecciones'),
    coleccionesBloque: qs('#bloqueColecciones'),
    colores: qs('#filtroColores'),
    precio: qs('#filtroPrecio'),
    buscar: qs('#tiendaBuscar'),
    orden: qs('#tiendaOrden'),
    total: qs('#tiendaTotal'),
    resumen: qs('#tiendaResumen'),
    vacio: qs('#tiendaVacio'),
    mas: qs('#tiendaMas'),
    masTexto: qs('#tiendaMas span'),
    activos: qs('#filtrosActivos'),
    activosBloque: qs('#bloqueActivos'),
    panel: qs('#tiendaFiltros'),
    fondo: qs('#tiendaFondo'),
    botonFiltros: qs('#abrirFiltros'),
    contadorMovil: qs('#contadorFiltros'),
    verResultados: qs('#verResultados'),
    inicioResultados: qs('#resultados'),
  };
  if (!refs.grid) return;

  // Alto real del header para que la barra y los filtros fijos no queden debajo
  const header = qs('#header');
  const medirHeader = () => {
    if (header) document.documentElement.style.setProperty('--alto-header', `${Math.round(header.offsetHeight)}px`);
  };
  medirHeader();
  window.addEventListener('resize', medirHeader);

  leerUrl();
  refs.buscar.value = estado.q;
  refs.orden.value = estado.orden;

  const reiniciar = () => { estado.visibles = POR_PAGINA; };
  const toggle = (set, valor) => (set.has(valor) ? set.delete(valor) : set.add(valor));

  // Búsqueda con pequeña espera para no repintar en cada letra
  let t = 0;
  refs.buscar.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      estado.q = refs.buscar.value;
      reiniciar();
      pintarResultados({ mantenerScroll: true });
    }, 180);
  });
  qs('#tiendaBuscarForm')?.addEventListener('submit', (e) => { e.preventDefault(); refs.buscar.blur(); });

  refs.orden.addEventListener('change', () => {
    estado.orden = refs.orden.value;
    reiniciar();
    pintarResultados();
  });

  refs.grupos.addEventListener('click', (e) => {
    const b = e.target.closest('[data-grupo]');
    if (!b) return;
    estado.grupo = b.dataset.grupo;
    // La colección solo existe en gorras: si cambian de categoría, se suelta
    if (estado.grupo !== 'Gorras' && estado.grupo !== 'todo') estado.colecciones.clear();
    reiniciar();
    pintarResultados();
  });

  refs.panel.addEventListener('change', (e) => {
    const input = e.target;
    if (input.name === 'marca') toggle(estado.marcas, input.value);
    else if (input.name === 'coleccion') toggle(estado.colecciones, input.value);
    else if (input.name === 'precio') estado.precio = input.value;
    else return;
    reiniciar();
    pintarResultados({ mantenerScroll: refs.panel.classList.contains('is-open') });
  });

  refs.panel.addEventListener('click', (e) => {
    const color = e.target.closest('[data-color]');
    if (color) {
      toggle(estado.colores, color.dataset.color);
      reiniciar();
      pintarResultados({ mantenerScroll: refs.panel.classList.contains('is-open') });
      return;
    }
    if (e.target.closest('[data-limpiar-panel]')) limpiar();
    if (e.target.closest('.tienda-filtros__cerrar') || e.target.closest('#verResultados')) cerrarPanel();
  });

  const limpiar = () => {
    estado.q = '';
    refs.buscar.value = '';
    estado.grupo = 'todo';
    estado.marcas.clear();
    estado.colecciones.clear();
    estado.colores.clear();
    estado.precio = 'todos';
    reiniciar();
    pintarResultados();
  };

  refs.activos.addEventListener('click', (e) => {
    if (e.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const { quitar, valor } = b.dataset;
    if (quitar === 'q') { estado.q = ''; refs.buscar.value = ''; }
    if (quitar === 'grupo') estado.grupo = 'todo';
    if (quitar === 'marca') estado.marcas.delete(valor);
    if (quitar === 'coleccion') estado.colecciones.delete(valor);
    if (quitar === 'color') estado.colores.delete(valor);
    if (quitar === 'precio') estado.precio = 'todos';
    reiniciar();
    pintarResultados({ mantenerScroll: true });
  });

  qs('#tiendaVacioLimpiar')?.addEventListener('click', limpiar);

  refs.mas.addEventListener('click', () => {
    const antes = estado.visibles;
    estado.visibles += POR_PAGINA;
    pintarResultados({ mantenerScroll: true });
    qsa('.card', refs.grid)[antes]?.querySelector('.card__buy')?.focus({ preventScroll: true });
  });

  refs.botonFiltros.addEventListener('click', abrirPanel);
  refs.fondo.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && refs.panel.classList.contains('is-open')) cerrarPanel();
  });
  // Si pasan a escritorio con el panel abierto, se suelta el bloqueo
  window.matchMedia('(min-width: 1000px)').addEventListener('change', (m) => { if (m.matches) cerrarPanel(); });

  initCompraRapida(refs.grid);
  pintarResultados({ mantenerScroll: true });

  // Si llegan con una categoría marcada (ej. desde el inicio), que se vea la pestaña activa
  const activa = qs('.tienda-cat.is-active', refs.grupos);
  if (activa) refs.grupos.scrollLeft = activa.offsetLeft - refs.grupos.clientWidth / 2 + activa.offsetWidth / 2;
}
