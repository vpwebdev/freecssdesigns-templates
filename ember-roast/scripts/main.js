/* ============================================
   EMBER & ROAST — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // ---- Scroll Reveal ----
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ---- Header scroll effect ----
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile nav toggle ----
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
      document.body.style.overflow = navLinks.classList.contains('mobile-open')
        ? 'hidden'
        : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Menu page tab filtering ----
  function initMenuTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    const categories = document.querySelectorAll('[data-category]');
    if (!tabs.length || !categories.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Update active tab
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const selected = tab.dataset.tab;

        categories.forEach((cat) => {
          if (selected === 'all' || cat.dataset.category === selected) {
            cat.style.display = '';
          } else {
            cat.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Dynamic "today" for hours table ----
  function initTodayHours() {
    const todayRow = document.querySelector('.hours-today');
    if (!todayRow) return;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const cells = todayRow.querySelectorAll('td');

    const hours = {
      Monday: '6:30 AM – 6:00 PM',
      Tuesday: '6:30 AM – 6:00 PM',
      Wednesday: '6:30 AM – 6:00 PM',
      Thursday: '6:30 AM – 6:00 PM',
      Friday: '6:30 AM – 6:00 PM',
      Saturday: '7:00 AM – 5:00 PM',
      Sunday: '8:00 AM – 3:00 PM',
    };

    if (cells.length >= 2) {
      cells[0].textContent = 'Today (' + today + ')';
      const closingTime = hours[today].split('–')[1].trim();
      cells[1].textContent = 'Open until ' + closingTime;
    }
  }

  // ---- Card tilt on hover ----
  function initCardTilt() {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
        card.style.transform =
          'translateY(-6px) perspective(800px) rotateX(' + -y + 'deg) rotateY(' + x + 'deg)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---- Smooth anchor scroll ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---- Newsletter form feedback ----
  function initForms() {
    document.querySelectorAll('form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          const originalText = btn.textContent;
          btn.textContent = 'Sent!';
          btn.style.background = '#5A7247';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            form.reset();
          }, 2000);
        }
      });
    });
  }

  // ---- Init everything on DOM ready ----
  function init() {
    initScrollReveal();
    initHeaderScroll();
    initMobileNav();
    initMenuTabs();
    initTodayHours();
    initCardTilt();
    initSmoothScroll();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
