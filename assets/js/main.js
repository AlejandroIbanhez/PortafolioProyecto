/*
 * Estación MPS · Portafolio del Proyecto Integrador
 * JavaScript sin dependencias. La página es legible y navegable sin este archivo:
 * aquí solo se añaden mejoras progresivas.
 *   1. Conmutador de tema claro / oscuro (persistente)
 *   2. Menú móvil
 *   3. Sección activa en la navegación
 *   4. Revelado al hacer scroll (respeta prefers-reduced-motion)
 *   5. Lightbox accesible con <dialog>
 */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var CLAVE_TEMA = 'mps-tema';

  function guardar(clave, valor) {
    try { localStorage.setItem(clave, valor); } catch (e) { /* almacenamiento no disponible */ }
  }

  /* ---------- 1. Tema ---------- */
  var botonTema = document.getElementById('conmutador-tema');
  var consultaOscuro = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function temaEfectivo() {
    var manual = root.getAttribute('data-theme');
    if (manual === 'light' || manual === 'dark') return manual;
    return consultaOscuro && consultaOscuro.matches ? 'dark' : 'light';
  }

  function actualizarBotonTema() {
    if (!botonTema) return;
    var destino = temaEfectivo() === 'dark' ? 'claro' : 'oscuro';
    botonTema.setAttribute('aria-label', 'Cambiar a tema ' + destino);
    botonTema.setAttribute('title', 'Cambiar a tema ' + destino);
  }

  if (botonTema) {
    botonTema.addEventListener('click', function () {
      var nuevo = temaEfectivo() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', nuevo);
      guardar(CLAVE_TEMA, nuevo);
      actualizarBotonTema();
    });
    if (consultaOscuro && consultaOscuro.addEventListener) {
      consultaOscuro.addEventListener('change', actualizarBotonTema);
    }
    actualizarBotonTema();
  }

  /* ---------- 2. Menú móvil ---------- */
  var botonMenu = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu-principal');

  function cerrarMenu(devolverFoco) {
    if (!menu || !botonMenu) return;
    menu.classList.remove('is-open');
    botonMenu.setAttribute('aria-expanded', 'false');
    if (devolverFoco) botonMenu.focus();
  }

  if (botonMenu && menu) {
    botonMenu.addEventListener('click', function () {
      var abierto = menu.classList.toggle('is-open');
      botonMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrarMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) cerrarMenu(true);
    });

    document.addEventListener('click', function (e) {
      if (menu.classList.contains('is-open') && !e.target.closest('.site-header')) cerrarMenu(false);
    });
  }

  /* ---------- 3. Sección activa ---------- */
  var enlaces = menu ? Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]')) : [];
  var porId = {};
  enlaces.forEach(function (a) { porId[a.getAttribute('href').slice(1)] = a; });

  function marcarActiva(id) {
    enlaces.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (id && porId[id]) porId[id].setAttribute('aria-current', 'true');
  }

  if ('IntersectionObserver' in window && enlaces.length) {
    var espia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          var id = entrada.target.id;
          marcarActiva(porId[id] ? id : null);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    Array.prototype.forEach.call(document.querySelectorAll('main section[id]'), function (s) {
      espia.observe(s);
    });
  }

  /* ---------- 4. Revelado al hacer scroll ---------- */
  var revelables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mostrarTodo() {
    revelables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (sinMovimiento || !('IntersectionObserver' in window)) {
    mostrarTodo();
  } else {
    var revelador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          obs.unobserve(entrada.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revelables.forEach(function (el) { revelador.observe(el); });

    // Si se llega por ancla o se imprime, no dejar contenido oculto.
    window.addEventListener('beforeprint', mostrarTodo);
  }

  /* ---------- 5. Lightbox ---------- */
  var dialogo = document.getElementById('lightbox');
  var disparadores = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));

  if (dialogo && typeof dialogo.showModal === 'function' && disparadores.length) {
    var imagen = document.getElementById('lightbox-img');
    var leyenda = document.getElementById('lightbox-caption');
    var contador = document.getElementById('lightbox-counter');
    var botonCerrar = document.getElementById('lightbox-close');
    var botonAnterior = document.getElementById('lightbox-prev');
    var botonSiguiente = document.getElementById('lightbox-next');
    var indice = 0;
    var origen = null;

    function pintar(i) {
      indice = (i + disparadores.length) % disparadores.length;
      var enlace = disparadores[indice];
      var miniatura = enlace.querySelector('img');
      imagen.src = enlace.getAttribute('href');
      imagen.alt = miniatura ? miniatura.alt : '';
      if (miniatura && miniatura.getAttribute('width')) {
        imagen.width = Number(miniatura.getAttribute('width'));
        imagen.height = Number(miniatura.getAttribute('height'));
      }
      leyenda.textContent = enlace.getAttribute('data-caption') || '';
      contador.textContent = 'Imagen ' + (indice + 1) + ' de ' + disparadores.length;
    }

    function abrir(i, disparador) {
      origen = disparador;
      pintar(i);
      dialogo.showModal();
      root.classList.add('is-locked');
      botonCerrar.focus();
    }

    disparadores.forEach(function (enlace, i) {
      enlace.addEventListener('click', function (e) {
        // Respeta abrir en pestaña nueva con teclas modificadoras.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        abrir(i, enlace);
      });
    });

    botonCerrar.addEventListener('click', function () { dialogo.close(); });
    botonAnterior.addEventListener('click', function () { pintar(indice - 1); });
    botonSiguiente.addEventListener('click', function () { pintar(indice + 1); });

    dialogo.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); pintar(indice - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); pintar(indice + 1); }
    });

    // Clic en el fondo (fuera del contenido) cierra.
    dialogo.addEventListener('click', function (e) {
      if (e.target === dialogo) dialogo.close();
    });

    // 'close' cubre botón, Escape y clic en el fondo.
    dialogo.addEventListener('close', function () {
      root.classList.remove('is-locked');
      if (origen && typeof origen.focus === 'function') origen.focus();
      origen = null;
    });
  }
})();
