/* ================================================================
   MAIN.JS — Sushi Omakase
   Scroll reveal, header, navigation, tabs, forms, FAQ
   ================================================================ */

(function () {
  'use strict';

  /* ---- Scroll Reveal (Intersection Observer) ---- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ---- Header Scroll Behavior ---- */
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var scrolled = false;

    function onScroll() {
      var shouldBeScrolled = window.scrollY > 40;
      if (shouldBeScrolled !== scrolled) {
        scrolled = shouldBeScrolled;
        header.classList.toggle('scrolled', scrolled);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ---- Mobile Navigation ---- */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var overlay = document.getElementById('mobile-overlay');
    if (!toggle || !overlay) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.classList.toggle('active');
      overlay.classList.toggle('open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    });

    // Close on link click
    var links = overlay.querySelectorAll('.nav-link, .nav-cta');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        overlay.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        toggle.classList.remove('active');
        overlay.classList.remove('open');
        document.body.classList.remove('nav-open');
      }
    });
  }


  /* ---- Menu Tabs ---- */
  function initMenuTabs() {
    var tabButtons = document.querySelectorAll('.tab-btn');
    var tabPanels = document.querySelectorAll('.tab-panel');
    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');

        // Update buttons
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Update panels
        tabPanels.forEach(function (panel) {
          var isTarget = panel.getAttribute('data-panel') === target;
          panel.classList.toggle('active', isTarget);
        });
      });
    });
  }


  /* ---- FAQ Accordion ---- */
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        var wasOpen = item.classList.contains('open');

        // Close all
        faqItems.forEach(function (i) { i.classList.remove('open'); });

        // Toggle current
        if (!wasOpen) {
          item.classList.add('open');
        }
      });
    });
  }


  /* ---- Form Handling ---- */
  function initForms() {
    // Reservation Form
    var resForm = document.getElementById('reservation-form');
    if (resForm) {
      initFormHandler(resForm, 'form-message', 'Thank you! Your reservation request has been received. We will confirm by email within 24 hours.');
    }

    // Contact Form
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
      initFormHandler(contactForm, 'contact-form-message', 'Thank you for reaching out. We will respond within one business day.');
    }
  }

  function initFormHandler(form, messageId, successText) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var messageEl = document.getElementById(messageId);
      if (!messageEl) return;

      // Basic validation
      var required = form.querySelectorAll('[required]');
      var valid = true;

      required.forEach(function (field) {
        field.style.borderColor = '';

        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--color-salmon)';
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(field.value.trim())) {
            valid = false;
            field.style.borderColor = 'var(--color-salmon)';
          }
        }
      });

      if (!valid) {
        messageEl.className = 'form-message form-message--error';
        messageEl.textContent = 'Please complete all required fields correctly.';
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // Simulate submission
      var submitBtn = form.querySelector('[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(function () {
        messageEl.className = 'form-message form-message--success';
        messageEl.textContent = successText;
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Clear styles
        required.forEach(function (field) {
          field.style.borderColor = '';
        });
      }, 1200);
    });

    // Clear error border on input
    var fields = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    fields.forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
      });
      field.addEventListener('change', function () {
        field.style.borderColor = '';
      });
    });
  }


  /* ---- Smooth Scroll for Anchor Links ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }


  /* ---- Set Minimum Date on Reservation Form ---- */
  function initDateConstraints() {
    var dateInput = document.getElementById('res-date');
    if (!dateInput) return;

    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate() + 1).padStart(2, '0'); // Tomorrow minimum
    dateInput.setAttribute('min', year + '-' + month + '-' + day);
  }


  /* ---- Initialize Everything ---- */
  function init() {
    initScrollReveal();
    initHeaderScroll();
    initMobileNav();
    initMenuTabs();
    initFAQ();
    initForms();
    initSmoothScroll();
    initDateConstraints();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
