/* Catálogo real de OGCLEAN. Las imágenes viven en assets/img/<linea>/<img>.webp
   (con variante -sm.webp para pantallas pequeñas). */

export const PRECIOS = { caps: 85000, sneakers: 185000 };

export const TALLAS = {
  caps: ['7', '7 1/8', '7 1/4', '7 3/8', '7 1/2', '7 5/8', '7 3/4'],
  sneakers: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
};

export const UNIDAD_TALLA = { caps: '', sneakers: ' US' };

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
  { img: 'kyrie3-blanco', name: 'Nike Kyrie 3', tag: 'Blanco iridiscente', alt: 'Tenis Nike Kyrie 3 blanco iridiscente', cat: 'neutro', color: 'Blanco' },
  { img: 'kyrie-blanco-oro', name: 'Nike Low', tag: 'Blanco / Oro', alt: 'Tenis Nike blanco con detalles dorados', cat: 'neutro', color: 'Blanco / Oro' },
  { img: 'kyrie4-negro', name: 'Nike Kyrie 4', tag: 'Negro total', alt: 'Tenis Nike Kyrie 4 negro', cat: 'neutro', color: 'Negro' },
  { img: 'kyrie5-lila', name: 'Nike Kyrie 5', tag: 'Lila / Rosa', alt: 'Tenis Nike Kyrie 5 lila y rosa', cat: 'color', color: 'Lila / Rosa' },
  { img: 'kyrie7-morado-azul', name: 'Nike Kyrie 7', tag: 'Azul / Amarillo', alt: 'Tenis Nike Kyrie 7 azul y amarillo', cat: 'color', color: 'Azul / Amarillo' },
  { img: 'kyrie7-lila-rosa', name: 'Nike Kyrie 7', tag: 'Lila / Rosa', alt: 'Tenis Nike Kyrie 7 lila y rosa', cat: 'color', color: 'Lila / Rosa' },
  { img: 'kyrie7-verde-amarillo', name: 'Nike Kyrie 7', tag: 'Verde / Amarillo', alt: 'Tenis Nike Kyrie 7 verde y amarillo', cat: 'color', color: 'Verde / Amarillo' },
  { img: 'kyrie7-verde-azul', name: 'Nike Kyrie 7', tag: 'Verde / Azul', alt: 'Tenis Nike Kyrie 7 verde y azul', cat: 'color', color: 'Verde / Azul' },
];

/** Normaliza un item del catálogo con todo lo que la UI necesita. */
function decorar(item, linea, idx) {
  return {
    ...item,
    linea,
    idx,
    id: `${linea}-${item.img}`,
    precio: PRECIOS[linea],
    tallas: TALLAS[linea],
    unidad: UNIDAD_TALLA[linea],
    src: `assets/img/${linea}/${item.img}.webp`,
    srcSm: `assets/img/${linea}/${item.img}-sm.webp`,
    tipo: linea === 'caps' ? 'Gorra fitted' : 'Tenis',
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
    items: CAPS.map((c, i) => decorar(c, 'caps', i)),
    filtros: [
      { id: 'all', label: 'Todas' },
      { id: 'mlb', label: 'MLB' },
      { id: 'wbc', label: 'World Baseball Classic' },
    ],
  },
  sneakers: {
    id: 'sneakers',
    titulo: 'Tenis',
    singular: 'par',
    plural: 'pares',
    kicker: 'Línea Nike Kyrie',
    desc: 'Siluetas de cancha con colorways que no se ven en cualquier parte.',
    items: SNEAKERS.map((s, i) => decorar(s, 'sneakers', i)),
    filtros: [
      { id: 'all', label: 'Todos' },
      { id: 'color', label: 'Colorway' },
      { id: 'neutro', label: 'Neutros' },
    ],
  },
};

export const TODOS = [...LINEAS.caps.items, ...LINEAS.sneakers.items];

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
].map(porId);
