/* Pulse Analytics — Main JS */
(function () {
  'use strict';

  /* ---- Sidebar Toggle (Mobile) ---- */
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const overlay = document.querySelector('.sidebar-overlay');

  function openSidebar() {
    sidebar?.classList.add('sidebar--open');
    overlay?.classList.add('sidebar-overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar?.classList.remove('sidebar--open');
    overlay?.classList.remove('sidebar-overlay--visible');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', function () {
    if (sidebar?.classList.contains('sidebar--open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay?.addEventListener('click', closeSidebar);

  /* ---- Settings Tabs ---- */
  const tabBtns = document.querySelectorAll('.tabs__btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');

      tabBtns.forEach(function (b) { b.classList.remove('tabs__btn--active'); });
      tabPanels.forEach(function (p) { p.classList.remove('tab-panel--active'); });

      btn.classList.add('tabs__btn--active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('tab-panel--active');
    });
  });

  /* ---- Search Filter (Customers page) ---- */
  const searchInput = document.querySelector('.toolbar__search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.toLowerCase();
      var rows = document.querySelectorAll('.data-table tbody tr');
      rows.forEach(function (row) {
        var text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  /* ---- Toggle Switches ---- */
  // CSS-only toggles using checkbox — no JS needed, but we handle aria
  document.querySelectorAll('.toggle__input').forEach(function (input) {
    input.addEventListener('change', function () {
      this.setAttribute('aria-checked', this.checked);
    });
  });

  /* ---- Close sidebar on window resize to desktop ---- */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      closeSidebar();
    }
  });

  /* ---- Animate stat numbers on scroll ---- */
  var observed = false;
  var statNumbers = document.querySelectorAll('.stat-card__value');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !observed) {
          observed = true;
          statNumbers.forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        }
      });
    }, { threshold: 0.3 });
    statNumbers.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }
})();
