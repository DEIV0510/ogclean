/* Catálogo real de OGCLEAN. Las imágenes viven en assets/img/<linea>/<img>.webp
   (con variante -sm.webp para pantallas pequeñas). */

import { ZAPATOS } from './zapatos.js';
import { GORRAS } from './gorras.js';

/* Precio por defecto de cada línea. En zapatillas solo los Kyrie tienen precio
   confirmado: el resto trae su propio `precio` (null = se cotiza por WhatsApp). */
export const PRECIOS = { caps: 85000, sneakers: 185000 };

export const TALLAS = {
  caps: ['7', '7 1/8', '7 1/4', '7 3/8'],
  // Básquetbol conserva talla US, como ya estaba publicado
  basquetbol: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
  // Botas y zapatillas de calle: talla colombiana confirmada por el dueño
  botas: ['40', '41', '42', '43', '44'],
  hombre: ['40', '41', '42', '43', '44'],
  dama: ['36', '37', '38', '39'],
};

export const UNIDAD_TALLA = { caps: '', basquetbol: ' US', botas: '', hombre: '', dama: '' };

/** Grupo de talla de una zapatilla/bota: solo básquetbol conserva US;
 *  botas y calle usan talla colombiana (botas = rango hombre). */
function grupoTalla(item) {
  if (item.deporte === 'basquetbol') return 'basquetbol';
  if (/bota/i.test(item.name)) return 'botas'; // item aún no tiene `tipo`: se decora más abajo
  return item.genero === 'dama' ? 'dama' : 'hombre';
}

export const CAPS = [
  { img: 'mets-rojo', name: 'New York Mets', tag: 'Shea Stadium 40th', alt: 'Gorra fitted New York Mets roja', cat: 'mlb', color: 'Rojo' },
  { img: 'dodgers-rojo', name: 'Los Angeles Dodgers', tag: 'Script bordado', alt: 'Gorra fitted Los Angeles Dodgers roja', cat: 'mlb', color: 'Rojo' },
  { img: 'mexico-caqui', name: 'Selección México', tag: 'World Baseball Classic', alt: 'Gorra fitted selección México caqui', cat: 'wbc', color: 'Caqui' },
  { img: 'mexico-verde', name: 'Selección México', tag: 'World Baseball Classic', alt: 'Gorra fitted selección México verde', cat: 'wbc', color: 'Verde' },
  { img: 'pirates-rojo', name: 'Pittsburgh Pirates', tag: 'Patch All-Star Game', alt: 'Gorra fitted Pittsburgh Pirates roja', cat: 'mlb', color: 'Rojo' },
  { img: 'yankees-rojo', name: 'New York Yankees', tag: 'Tono sobre tono', alt: 'Gorra fitted New York Yankees roja', cat: 'mlb', color: 'Rojo' },
  { img: 'astros-caqui', name: 'Houston Astros', tag: '45 aniversario', alt: 'Gorra fitted Houston Astros caqui', cat: 'mlb', color: 'Caqui' },
  { img: 'bluejays-azul', name: 'Toronto Blue Jays', tag: '40th Season', alt: 'Gorra fitted Toronto Blue Jays azul', cat: 'mlb', color: 'Azul' },
  { img: 'padres-cafe', name: 'San Diego Padres', tag: 'All patches', alt: 'Gorra fitted San Diego Padres café', cat: 'mlb', color: 'Café' },
  { img: 'mets-azul', name: 'New York Mets', tag: '25 aniversario', alt: 'Gorra fitted New York Mets azul', cat: 'mlb', color: 'Azul' },
  { img: 'bluejays-marino', name: 'Toronto Blue Jays', tag: '30th Season', alt: 'Gorra fitted Toronto Blue Jays marino', cat: 'mlb', color: 'Marino' },
  { img: 'whitesox-negro', name: 'Chicago White Sox', tag: 'World Series 05', alt: 'Gorra fitted Chicago White Sox negra', cat: 'mlb', color: 'Negro' },
  { img: 'mexico-negro', name: 'Selección México', tag: 'Edición BXR', alt: 'Gorra fitted selección México negra', cat: 'wbc', color: 'Negro' },
  { img: 'braves-caqui', name: 'Atlanta Braves', tag: 'All-Star Game 2000', alt: 'Gorra fitted Atlanta Braves caqui', cat: 'mlb', color: 'Caqui' },
  { img: 'yankees-negro-oro', name: 'New York Yankees', tag: 'Greetings from NY', alt: 'Gorra fitted New York Yankees negra y dorada', cat: 'mlb', color: 'Negro / Oro' },
];

export const SNEAKERS = [
  { img: 'kyrie3-blanco', deporte: 'basquetbol', name: 'Nike Kyrie 3', tag: 'Blanco iridiscente', alt: 'Tenis Nike Kyrie 3 blanco iridiscente', cat: 'neutro', color: 'Blanco', marca: 'Nike', carpeta: 'sneakers', precio: 185000 },
  { img: 'kyrie-blanco-oro', deporte: 'basquetbol', name: 'Nike Low', tag: 'Blanco / Oro', alt: 'Tenis Nike blanco con detalles dorados', cat: 'neutro', color: 'Blanco / Oro', marca: 'Nike', carpeta: 'sneakers', precio: 185000 },
  { img: 'kyrie4-negro', deporte: 'basquetbol', name: 'Nike Kyrie 4', tag: 'Negro total', alt: 'Tenis Nike Kyrie 4 negro', cat: 'neutro', color: 'Negro', marca: 'Nike', carpeta: 'sneakers', precio: 185000 },
  { img: 'kyrie5-lila', deporte: 'basquetbol', name: 'Nike Kyrie 5', tag: 'Lila / Rosa', alt: 'Tenis Nike Kyrie 5 lila y rosa', cat: 'color', color: 'Lila / Rosa', marca: 'Nike', carpeta: 'sneakers', precio: 185000 },
  { img: 'kyrie7-morado-azul', deporte: 'basquetbol', name: 'Nike Kyrie 7', tag: 'Azul / Amarillo', alt: 'Tenis Nike Kyrie 7 azul y amarillo', cat: 'color', color: 'Azul / Amarillo', marca: 'Nike', carpeta: 'sneakers', precio: 185000 },
  { img: 'kyrie7-lila-rosa', deporte: 'basquetbol', name: 'Nike Kyrie 7', tag: 'Lila / Rosa', alt: 'Tenis Nike Kyrie 7 lila y rosa', cat: 'color', color: 'Lila / Rosa', marca: 'Nike', carpeta: 'sneakers', precio: 185000 },
  { img: 'kyrie7-verde-amarillo', deporte: 'basquetbol', name: 'Nike Kyrie 7', tag: 'Verde / Amarillo', alt: 'Tenis Nike Kyrie 7 verde y amarillo', cat: 'color', color: 'Verde / Amarillo', marca: 'Nike', carpeta: 'sneakers', precio: 185000 },
  { img: 'kyrie7-verde-azul', deporte: 'basquetbol', name: 'Nike Kyrie 7', tag: 'Verde / Azul', alt: 'Tenis Nike Kyrie 7 verde y azul', cat: 'color', color: 'Verde / Azul', marca: 'Nike', carpeta: 'sneakers', precio: 185000 },
];

/** Normaliza un item del catálogo con todo lo que la UI necesita. */
function decorar(item, linea, idx) {
  return {
    ...item,
    linea,
    idx,
    id: `${linea}-${item.img}`,
    precio: item.precio !== undefined ? item.precio : PRECIOS[linea],
    tallas: item.tallas && item.tallas.length ? item.tallas : TALLAS[linea === 'sneakers' ? grupoTalla(item) : linea],
    unidad: linea === 'sneakers' ? UNIDAD_TALLA[grupoTalla(item)] : UNIDAD_TALLA[linea],
    src: `assets/img/${item.carpeta || linea}/${item.img}.webp`,
    srcSm: `assets/img/${item.carpeta || linea}/${item.img}-sm.webp`,
    // Gorras en collage: la tarjeta muestra solo el frente; ficha y visor, la foto completa
    srcCard: item.carpeta === 'gorras' ? `assets/img/gorras/${item.img}-card.webp` : null,
    tipo: linea === 'caps'
      ? (item.cierre === 'Ajustable' ? 'Gorra ajustable' : 'Gorra cerrada')
      : (/bota/i.test(item.name) ? 'Botas' : 'Zapatillas'),
  };
}

export const LINEAS = {
  caps: {
    id: 'caps',
    titulo: 'Gorras',
    singular: 'gorra',
    plural: 'gorras',
    kicker: 'Fitted 59FIFTY',
    desc: 'Piezas cerradas, bordado limpio y parches originales de temporada.',
    items: [
      ...CAPS.map((c) => ({ ...c, cierre: 'Cerrada', equipo: c.name, liga: c.cat === 'wbc' ? 'World Baseball Classic' : 'MLB' })),
      ...GORRAS.map((g) => ({ ...g, carpeta: 'gorras', cat: g.liga })),
    ].map((c, i) => decorar(c, 'caps', i)),
    filtros: [
      { id: 'all', label: 'Todas' },
      { id: 'mlb', label: 'MLB' },
      { id: 'wbc', label: 'World Baseball Classic' },
    ],
  },
  sneakers: {
    id: 'sneakers',
    titulo: 'Zapatillas',
    singular: 'par',
    plural: 'pares',
    kicker: 'Multimarca',
    desc: 'Nike, Jordan, Adidas, Salomon, On, New Balance y más, en tu talla.',
    items: [...SNEAKERS, ...ZAPATOS.map((z) => ({ ...z, carpeta: 'zapatos', cat: z.marca }))]
      .map((s, i) => decorar(s, 'sneakers', i)),
    filtros: [],
  },
};

/* Zapatillas: un filtro por marca (las de 3+ referencias) y el resto en "Otras" */
(() => {
  const conteo = {};
  LINEAS.sneakers.items.forEach((p) => { conteo[p.marca] = (conteo[p.marca] || 0) + 1; });
  const grandes = Object.keys(conteo).filter((m) => m !== 'Otras' && conteo[m] >= 3)
    .sort((a, b) => conteo[b] - conteo[a]);
  LINEAS.sneakers.items.forEach((p) => { p.cat = grandes.includes(p.marca) ? p.marca : 'Otras'; });
  const otras = LINEAS.sneakers.items.filter((p) => p.cat === 'Otras').length;
  LINEAS.sneakers.filtros = [
    { id: 'all', label: 'Todas', n: LINEAS.sneakers.items.length },
    ...grandes.map((m) => ({ id: m, label: m, n: conteo[m] })),
    ...(otras ? [{ id: 'Otras', label: 'Otras marcas', n: otras }] : []),
  ];
})();

/* Video 360° real que venía en la carpeta de zapatos */
const bape = LINEAS.sneakers.items.find((p) => p.img === 'bape-road-sta-azul-marino');
if (bape) bape.video = 'assets/video/zapatos/bape-road-sta-azul-marino.mp4';

/* ---------- Facetas para la tienda (derivadas de los datos reales) ---------- */

/* Familias de color: una pieza puede estar en varias ("Blanco / Rojo") */
const FAMILIAS_COLOR = [
  ['Blanco', /blanc|perla/],
  ['Negro', /negr/],
  ['Gris', /gris|cemento/],
  ['Plata', /plata|iridiscente/],
  ['Rojo', /roj|vinotinto/],
  ['Rosa', /rosa|durazno|salm/],
  ['Morado', /morad|lila/],
  ['Azul', /azul|marino|celeste|turquesa/],
  ['Verde', /verde|menta|oliva/],
  ['Amarillo', /amarill|oro|dorad|mostaza/],
  ['Naranja', /naranja/],
  ['Café y beige', /caf|caqui|beige|crema|arena|trigo/],
  ['Estampado', /camuflad|estampad|monograma|salpicad|multicolor/],
];

const minus = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

[...LINEAS.caps.items, ...LINEAS.sneakers.items].forEach((p) => {
  const texto = minus(`${p.color} ${p.tag}`);
  p.colores = FAMILIAS_COLOR.filter(([, re]) => re.test(texto)).map(([nombre]) => nombre);
  if (p.linea === 'caps') {
    p.grupo = p.cierre === 'Ajustable' ? 'Gorras ajustables' : 'Gorras cerradas';
    p.equipo = p.equipo || null;
  } else if (p.tipo === 'Botas') {
    p.grupo = 'Botas';
  } else if (p.deporte === 'basquetbol') {
    p.grupo = 'Básquetbol';
  } else {
    p.grupo = p.genero === 'dama' ? 'Zapatillas dama' : 'Zapatillas hombre';
  }
});

export const TODOS = [...LINEAS.caps.items, ...LINEAS.sneakers.items];

/** Orden de colores para mostrar los filtros siempre igual */
export const ORDEN_COLORES = FAMILIAS_COLOR.map(([nombre]) => nombre);

export const porId = (id) => TODOS.find((p) => p.id === id);

/** Selección editorial para las secciones destacadas (piezas reales del catálogo). */
export const DESTACADOS = [
  'caps-padres-cafe',
  'sneakers-kyrie7-verde-azul',
  'caps-yankees-negro-oro',
  'sneakers-kyrie5-lila',
  'caps-whitesox-negro',
  'sneakers-kyrie3-blanco',
  'caps-mexico-verde',
  'sneakers-kyrie7-lila-rosa',
  'sneakers-jordan-air-jordan-4-blanco-rosa',
  'sneakers-salomon-xt-6-crema-cafe',
  'sneakers-on-cloud-crema-rosa',
  'sneakers-nike-dunk-low-blanco-cafe',
].map(porId).filter(Boolean);

/* Precio confirmado: número; sin confirmar: null */
export const tienePrecio = (p) => typeof p?.precio === 'number';

/* Precio anterior tachado: solo si el dueño da los DOS precios reales y el
   anterior es mayor. Nunca se inventa (sería un descuento falso).
   Para activarlo en un producto: { precio: 177900, precioAntes: 258900 } */
export function descuento(p) {
  if (!tienePrecio(p) || typeof p.precioAntes !== 'number' || p.precioAntes <= p.precio) return null;
  return {
    antes: p.precioAntes,
    ahorro: p.precioAntes - p.precio,
    porcentaje: Math.round((1 - p.precio / p.precioAntes) * 100),
  };
}
