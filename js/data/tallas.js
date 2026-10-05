/* Equivalencia de tallas que mandó el dueño (imagen «Escoge tu talla en Euro/EUR»,
   2026-09-30): talla nacional (Colombia) → talla Euro, que es la que usa todo el
   calzado de la tienda. Caballero 40–44 y dama 36–39, igual que TALLAS en products.js. */
export const GUIA_TALLAS = [
  { id: 'hombre', titulo: 'Caballero', filas: [['37/38', '40'], ['39', '41'], ['40', '42'], ['41', '43'], ['42', '44']] },
  { id: 'dama', titulo: 'Dama', filas: [['35', '36'], ['36', '37'], ['37', '38'], ['38', '39']] },
];

/* Gorras cerradas (59FIFTY): talla → contorno de la cabeza en cm, de la tabla oficial de
   New Era (neweracap.com/blogs/stories/new-era-cap-size-guide y neweracap.com.au/pages/59fifty-size-guide).
   Solo las tallas que maneja la tienda (TALLAS.caps). El dueño pidió explicar cómo escogerla (2026-10-04). */
export const GUIA_GORRAS = [['7', '55,8'], ['7 1/8', '56,8'], ['7 1/4', '57,7'], ['7 3/8', '58,7']];

/* Cómo medirse, según New Era: cinta en la mitad de la frente (donde va la banda, ~2,5 cm sobre las cejas),
   pareja alrededor de la parte más ancha de atrás, sin apretar; medir 2–3 veces; entre dos tallas, la mayor. */
export const PASOS_GORRAS = [
  'Rodea tu cabeza con un metro de costura por la mitad de la frente, unos 2,5 cm encima de las cejas, y por la parte más ancha de atrás.',
  'No aprietes el metro y mide 2 o 3 veces para estar seguro.',
  'Busca tu medida en la tabla. Si quedas entre dos tallas, elige la más grande.',
];
