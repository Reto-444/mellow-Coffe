/* ============================================================
   Mellow Coffee — script.js
   Плавная прокрутка, мобильное меню, появление блоков,
   подсветка активного пункта меню и запасной вариант для фото.
   ============================================================ */

(function () {
  'use strict';

  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var yearEl = document.getElementById('year');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOBILE_BREAKPOINT = 900;

  /* ---------- Текущий год в футере ---------- */
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Шапка: фон и тень при прокрутке ---------- */
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- Мобильное меню ---------- */
  function openMenu() {
    nav.classList.add('is-open');
    burger.classList.add('is-active');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    if (!nav || !nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    document.body.classList.remove('menu-open');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Закрываем меню при клике по любой ссылке внутри навигации
    nav.addEventListener('click', function (event) {
      var link = event.target.closest ? event.target.closest('a') : null;
      if (link) closeMenu();
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' || event.keyCode === 27) closeMenu();
    });

    // Закрытие при переходе на десктопную ширину
    window.addEventListener('resize', function () {
      if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
    });
  }

  /* ---------- Появление элементов при прокрутке ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function showAllReveal() {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAllReveal();
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          if (delay > 0) {
            el.style.transitionDelay = delay + 'ms';
          }

          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Подсветка активного пункта навигации ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var id = '#' + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        });
      },
      {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ---------- Запасной вариант, если фото не загрузилось ---------- */
  function hideBrokenImage(img) {
    img.classList.add('is-hidden');
  }

  Array.prototype.slice.call(document.querySelectorAll('.media img')).forEach(function (img) {
    // Изображение уже не смогло загрузиться до запуска скрипта
    if (img.complete && img.naturalWidth === 0) {
      hideBrokenImage(img);
    }
    img.addEventListener('error', function () {
      hideBrokenImage(img);
    });
  });
})();