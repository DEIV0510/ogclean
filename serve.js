/* Servidor estático mínimo para ver la tienda en local.
   Uso:  node serve.js      ->  http://localhost:5321
   (En internet no se usa: la tienda está en ogcleann.com y Vercel solo redirige.) */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUERTO = process.env.PORT || 5321;
const RAIZ = path.resolve(__dirname);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const escapar = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function responder(res, codigo, texto) {
  res.writeHead(codigo, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
  res.end(texto);
}

http.createServer((req, res) => {
  // Una dirección mal codificada (por ejemplo «/%E0%A4%A») hacía caer el servidor
  let url;
  try {
    url = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    responder(res, 400, '<h1>400</h1><p>Dirección inválida</p>');
    return;
  }

  // Nada de archivos ni carpetas ocultas (.git, .claude, .env…)
  if (url.split(/[\\/]/).some((parte) => parte.startsWith('.'))) {
    responder(res, 403, '<h1>403</h1><p>Prohibido</p>');
    return;
  }

  const archivo = path.resolve(RAIZ, '.' + (url === '/' ? '/index.html' : url));
  // Solo dentro de la carpeta del sitio (con el separador: «ogclean-wp» también empieza por «ogclean»)
  if (!archivo.startsWith(RAIZ + path.sep)) {
    responder(res, 403, '<h1>403</h1><p>Prohibido</p>');
    return;
  }

  fs.readFile(archivo, (err, datos) => {
    if (err) {
      responder(res, 404, '<h1>404</h1><p>No se encontró ' + escapar(url) + '</p>');
      return;
    }
    const ext = path.extname(archivo).toLowerCase();
    res.writeHead(200, {
      'Content-Type': TIPOS[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(datos);
  });
}).listen(PUERTO, () => {
  console.log(`OGCLEAN -> http://localhost:${PUERTO}`);
});
