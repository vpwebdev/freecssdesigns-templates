/* ============================================================
   DOMAINE NOIR — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Scroll-triggered reveal ---- */
  var revealEls = document.querySelectorAll('[data-animate]');
  if (revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Navbar scroll state ---- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile navigation ---- */
  var toggle = document.getElementById('navToggle');
  var overlay = document.getElementById('navOverlay');
  if (toggle && overlay) {
    toggle.addEventListener('click', function () {
      var open = overlay.classList.toggle('is-open');
      toggle.classList.toggle('is-active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    overlay.querySelectorAll('.nav__overlay-link').forEach(function (link) {
      link.addEventListener('click', function () {
        overlay.classList.remove('is-open');
        toggle.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Reservation form ---- */
  var form = document.getElementById('reservationForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.btn--primary');
      var original = btn.textContent;
      btn.textContent = 'Reservation Confirmed!';
      btn.style.background = 'var(--color-wine-light)';
      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = '';
        form.reset();
      }, 2500);
    });
  }
})();
