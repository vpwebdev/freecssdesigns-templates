/* ============================================================
   CRESTLINE REALTY — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Scroll-triggered reveal ---- */
  const revealEls = document.querySelectorAll('[data-animate]');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---- Navbar scroll state ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile navigation ---- */
  const toggle = document.getElementById('navToggle');
  const overlay = document.getElementById('navOverlay');
  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      const open = overlay.classList.toggle('is-open');
      toggle.classList.toggle('is-active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    overlay.querySelectorAll('.nav__overlay-link').forEach((link) => {
      link.addEventListener('click', () => {
        overlay.classList.remove('is-open');
        toggle.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Contact form (prevent default) ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn--primary');
      const original = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = 'var(--color-green-light)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        contactForm.reset();
      }, 2500);
    });
  }
})();
