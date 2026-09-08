/* "Arma tu combo": configurador gorra + tenis con total real y pedido
   precargado en WhatsApp (modelos, tallas y total). */

import { qs, qsa } from '../utils/dom.js';
import { LINEAS } from '../data/products.js';
import { wa, precioCOP } from '../data/site.js';
import { agregar } from '../components/cart.js';

const estado = {
  caps: { item: null, talla: '' },
  sneakers: { item: null, talla: '' },
};

function pintarThumbs(cont, linea, alElegir) {
  cont.innerHTML = LINEAS[linea].items
    .map((p, i) => `
      <button class="combo__thumb${i === 0 ? ' is-active' : ''}" type="button" role="option"
              aria-selected="${i === 0}" data-id="${p.id}" title="${p.name} — ${p.tag}">
        <img src="${p.srcSm}" alt="${p.alt}" loading="lazy" decoding="async" width="120" height="120">
      </button>`)
    .join('');

  cont.addEventListener('click', (e) => {
    const b = e.target.closest('.combo__thumb');
    if (!b) return;
    qsa('.combo__thumb', cont).forEach((t) => {
      const activo = t === b;
      t.classList.toggle('is-active', activo);
      t.setAttribute('aria-selected', String(activo));
    });
    alElegir(LINEAS[linea].items.find((p) => p.id === b.dataset.id));
  });
}

function pintarTallas(cont, linea, alElegir) {
  cont.innerHTML = LINEAS[linea].items[0].tallas
    .map((t) => `<button class="size" type="button" data-talla="${t}">${t}${LINEAS[linea].items[0].unidad}</button>`)
    .join('');

  cont.addEventListener('click', (e) => {
    const b = e.target.closest('.size');
    if (!b) return;
    qsa('.size', cont).forEach((s) => s.classList.toggle('is-active', s === b));
    alElegir(b.dataset.talla);
  });
}

export function initCombo() {
  const capThumbs = qs('#comboCapThumbs');
  const sneThumbs = qs('#comboSneThumbs');
  if (!capThumbs || !sneThumbs) return;

  const refs = {
    caps: { img: qs('#comboCapImg'), name: qs('#comboCapName'), tag: qs('#comboCapTag'), preview: qs('#comboCapImg')?.parentElement },
    sneakers: { img: qs('#comboSneImg'), name: qs('#comboSneName'), tag: qs('#comboSneTag'), preview: qs('#comboSneImg')?.parentElement },
  };
  const totalEl = qs('#comboTotal');
  const cta = qs('#comboCta');

  const total = () => (estado.caps.item?.precio || 0) + (estado.sneakers.item?.precio || 0);

  const mensaje = () => {
    const c = estado.caps.item;
    const s = estado.sneakers.item;
    const lineas = ['Hola OGCLEAN, quiero este combo:'];
    if (c) lineas.push(`• Gorra ${c.name} (${c.tag})${estado.caps.talla ? ` talla ${estado.caps.talla}` : ''} — ${precioCOP(c.precio)}`);
    if (s) lineas.push(`• Tenis ${s.name} (${s.tag})${estado.sneakers.talla ? ` talla ${estado.sneakers.talla} US` : ''} — ${precioCOP(s.precio)}`);
    lineas.push(`Total: ${precioCOP(total())}`);
    return lineas.join('\n');
  };

  const refrescar = () => {
    if (totalEl) totalEl.textContent = precioCOP(total());
    if (cta) cta.href = wa(mensaje());
  };

  const setItem = (linea, item) => {
    if (!item) return;
    estado[linea].item = item;
    const r = refs[linea];
    if (r.preview) r.preview.classList.add('is-swapping');
    setTimeout(() => {
      r.img.src = item.srcSm;
      r.img.alt = item.alt;
      r.name.textContent = item.name;
      r.tag.textContent = `${item.tag} · ${precioCOP(item.precio)}`;
      if (r.preview) r.preview.classList.remove('is-swapping');
    }, 160);
    refrescar();
  };

  pintarThumbs(capThumbs, 'caps', (item) => setItem('caps', item));
  pintarThumbs(sneThumbs, 'sneakers', (item) => setItem('sneakers', item));
  pintarTallas(qs('#comboCapSizes'), 'caps', (t) => { estado.caps.talla = t; refrescar(); });
  pintarTallas(qs('#comboSneSizes'), 'sneakers', (t) => { estado.sneakers.talla = `${t}`; refrescar(); });

  // Manda el combo completo al carrito (una línea por pieza)
  const add = qs('#comboAdd');
  if (add) {
    add.addEventListener('click', () => {
      const faltaTalla = !estado.caps.talla || !estado.sneakers.talla;
      if (faltaTalla) {
        [qs('#comboCapSizes'), qs('#comboSneSizes')].forEach((cont, i) => {
          const falta = i === 0 ? !estado.caps.talla : !estado.sneakers.talla;
          if (!cont || !falta) return;
          cont.classList.add('is-hint');
          setTimeout(() => cont.classList.remove('is-hint'), 900);
        });
        return;
      }
      agregar(estado.caps.item.id, estado.caps.talla);
      agregar(estado.sneakers.item.id, estado.sneakers.talla);
      const original = add.textContent;
      add.classList.add('is-added');
      add.textContent = '✓ Combo agregado';
      setTimeout(() => { add.classList.remove('is-added'); add.textContent = original; }, 1400);
    });
  }

  // Arranque con las piezas que ya están en el HTML
  setItem('caps', LINEAS.caps.items[0]);
  setItem('sneakers', LINEAS.sneakers.items[0]);
}
