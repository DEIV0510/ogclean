/* Datos de contacto e identidad. Fuente única de verdad para toda la web. */

export const SITE = {
  nombre: 'OGCLEAN',
  tagline: 'Estilo propio, al mejor precio.',
  whatsapp: {
    linea1: { numero: '573137558643', label: '+57 313 755 8643' },
    linea2: { numero: '573235182745', label: '+57 323 518 2745' },
  },
  redes: {
    facebook: 'https://www.facebook.com/profile.php?id=61577983661507',
    tiktok: 'https://www.tiktok.com/@ogclean.co',
    tiktokUser: '@ogclean.co',
  },
  envios: 'Envíos a toda Colombia',
};

/** Arma un enlace de WhatsApp con mensaje precargado. */
export function wa(mensaje, numero = SITE.whatsapp.linea1.numero) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** Formatea un precio colombiano: 85000 -> $85.000 */
export const precioCOP = (v) => `$${v.toLocaleString('es-CO')}`;
