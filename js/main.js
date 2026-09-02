(() => {
  'use strict';

  const WA_PRIMARY = '573137558643';
  const WA_SECONDARY = '573235182745';

  const waLink = (number, msg) => `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

  /* ===================== DATA ===================== */
  const CAPS = [
    { img: 'mets-rojo', name: 'New York Mets', tag: 'Shea Stadium 40th', alt: 'Gorra fitted New York Mets roja' },
    { img: 'dodgers-rojo', name: 'Los Angeles Dodgers', tag: 'Script bordado', alt: 'Gorra fitted Los Angeles Dodgers roja' },
    { img: 'mexico-caqui', name: 'Selección México', tag: 'World Baseball Classic', alt: 'Gorra fitted selección México caqui' },
    { img: 'mexico-verde', name: 'Selección México', tag: 'World Baseball Classic', alt: 'Gorra fitted selección México verde' },
    { img: 'pirates-rojo', name: 'Pittsburgh Pirates', tag: 'Patch All-Star Game', alt: 'Gorra fitted Pittsburgh Pirates roja' },
    { img: 'yankees-rojo', name: 'New York Yankees', tag: 'Tono sobre tono', alt: 'Gorra fitted New York Yankees roja' },
    { img: 'astros-caqui', name: 'Houston Astros', tag: '45 aniversario', alt: 'Gorra fitted Houston Astros caqui' },
    { img: 'bluejays-azul', name: 'Toronto Blue Jays', tag: '40th Season', alt: 'Gorra fitted Toronto Blue Jays azul' },
    { img: 'padres-cafe', name: 'San Diego Padres', tag: 'All patches', alt: 'Gorra fitted San Diego Padres café' },
    { img: 'mets-azul', name: 'New York Mets', tag: '25 aniversario', alt: 'Gorra fitted New York Mets azul' },
    { img: 'bluejays-marino', name: 'Toronto Blue Jays', tag: '30th Season', alt: 'Gorra fitted Toronto Blue Jays marino' },
    { img: 'whitesox-negro', name: 'Chicago White Sox', tag: 'World Series 05', alt: 'Gorra fitted Chicago White Sox negra' },
    { img: 'mexico-negro', name: 'Selección México', tag: 'Edición BXR', alt: 'Gorra fitted selección México negra' },
    { img: 'braves-caqui', name: 'Atlanta Braves', tag: 'All-Star Game 2000', alt: 'Gorra fitted Atlanta Braves caqui' },
    { img: 'yankees-negro-oro', name: 'New York Yankees', tag: 'Greetings from NY', alt: 'Gorra fitted New York Yankees negra y dorada' },
  ];

  const SNEAKERS = [
    { img: 'kyrie3-blanco', name: 'Nike Kyrie 3', tag: 'Blanco iridiscente', alt: 'Tenis Nike Kyrie 3 blanco iridiscente' },
    { img: 'kyrie-blanco-oro', name: 'Nike Low', tag: 'Blanco / Oro', alt: 'Tenis Nike blanco con detalles dorados' },
    { img: 'kyrie4-negro', name: 'Nike Kyrie 4', tag: 'Negro total', alt: 'Tenis Nike Kyrie 4 negro' },
    { img: 'kyrie5-lila', name: 'Nike Kyrie 5', tag: 'Lila / Rosa', alt: 'Tenis Nike Kyrie 5 lila y rosa' },
    { img: 'kyrie7-morado-azul', name: 'Nike Kyrie 7', tag: 'Azul / Amarillo', alt: 'Tenis Nike Kyrie 7 azul y amarillo' },
    { img: 'kyrie7-lila-rosa', name: 'Nike Kyrie 7', tag: 'Lila / Rosa', alt: 'Tenis Nike Kyrie 7 lila y rosa' },
    { img: 'kyrie7-verde-amarillo', name: 'Nike Kyrie 7', tag: 'Verde / Amarillo', alt: 'Tenis Nike Kyrie 7 verde y amarillo' },
    { img: 'kyrie7-verde-azul', name: 'Nike Kyrie 7', tag: 'Verde / Azul', alt: 'Tenis Nike Kyrie 7 verde y azul' },
  ];

  function renderGrid(container, items, folder){
    if(!container) return;
    const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.3-.6-2.1-1.1-3-2.5-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.5.5.2.9.4 1.3.5.5.2 1 .1 1.3-.1.4-.2 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z"/></svg>';
    container.innerHTML = items.map(item => `
      <article class="card">
        <div class="card__media">
          <span class="card__tag">${item.tag}</span>
          <img src="assets/img/${folder}/${item.img}.webp" srcset="assets/img/${folder}/${item.img}-sm.webp 500w, assets/img/${folder}/${item.img}.webp 1000w" sizes="(max-width:600px) 46vw, (max-width:1024px) 30vw, 22vw" alt="${item.alt}" loading="lazy" width="500" height="500">
        </div>
        <div class="card__body">
          <h3 class="card__name">${item.name}</h3>
          <p class="card__price">Precio por WhatsApp</p>
          <a class="card__btn js-wa" href="#" data-wa-msg="Hola OGCLEAN, quiero información y precio de: ${item.name} (${item.tag}).">${waIcon}Comprar por WhatsApp</a>
        </div>
      </article>
    `).join('');
  }

  renderGrid(document.getElementById('capsGrid'), CAPS, 'caps');
  renderGrid(document.getElementById('sneakersGrid'), SNEAKERS, 'sneakers');

  /* ===================== WhatsApp links ===================== */
  function bindWaLinks(){
    document.querySelectorAll('.js-wa').forEach(el => {
      el.setAttribute('href', waLink(WA_PRIMARY, el.dataset.waMsg || 'Hola OGCLEAN, quiero más información.'));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
    document.querySelectorAll('.js-wa2').forEach(el => {
      el.setAttribute('href', waLink(WA_SECONDARY, el.dataset.waMsg || 'Hola OGCLEAN, quiero más información.'));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
    const headerCta = document.getElementById('headerCta');
    if(headerCta){
      headerCta.setAttribute('href', waLink(WA_PRIMARY, 'Hola OGCLEAN, quiero comprar.'));
    }
  }
  bindWaLinks();

  /* ===================== Header scroll ===================== */
  const header = document.getElementById('header');
  const onScroll = () => {
    if(window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ===================== Mobile nav ===================== */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('navOverlay');

  function closeNav(){
    nav.classList.remove('is-open');
    overlay.classList.remove('is-active');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  function toggleNav(){
    const isOpen = nav.classList.toggle('is-open');
    overlay.classList.toggle('is-active', isOpen);
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  burger.addEventListener('click', toggleNav);
  overlay.addEventListener('click', closeNav);
  nav.querySelectorAll('.nav__link').forEach(a => a.addEventListener('click', closeNav));

  /* ===================== Reveal on scroll ===================== */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.15, rootMargin:'0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ===================== Loader ===================== */
  const loader = document.getElementById('loader');
  const hideLoader = () => loader.classList.add('is-done');
  window.addEventListener('load', () => setTimeout(hideLoader, 500));
  setTimeout(hideLoader, 2500); // failsafe

  /* ===================== Footer year ===================== */
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

})();
