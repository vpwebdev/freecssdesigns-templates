(function () {
  'use strict';

  /* ==========================================================
     SCROLL REVEAL — Intersection Observer
     ========================================================== */
  var animEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show everything */
    animEls.forEach(function (el) { el.classList.add('is-visible'); });
  }


  /* ==========================================================
     HEADER — scroll behaviour
     ========================================================== */
  var header = document.getElementById('site-header');
  var scrollThreshold = 80;

  function onScroll() {
    if (!header) return;
    if (window.scrollY > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ==========================================================
     MOBILE NAV — toggle
     ========================================================== */
  var toggle = document.getElementById('nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('is-open');
      mobileNav.classList.toggle('is-open');
      toggle.classList.toggle('is-active');
      toggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    /* Close when clicking a link */
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }


  /* ==========================================================
     SMOOTH SCROLL — for same-page anchors
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ==========================================================
     CONTACT FORM — basic handling
     ========================================================== */
  var form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var origText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.disabled = true;
      btn.style.opacity = '0.6';
      setTimeout(function () {
        btn.textContent = origText;
        btn.disabled = false;
        btn.style.opacity = '';
        form.reset();
      }, 2500);
    });
  }

})();
