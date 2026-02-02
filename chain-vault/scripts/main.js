/* ChainVault — Main JS */
(function () {
  'use strict';

  /* ---- Sidebar Toggle (Mobile) ---- */
  var sidebar = document.querySelector('.sidebar');
  var toggleBtn = document.querySelector('.sidebar-toggle');
  var overlay = document.querySelector('.sidebar-overlay');

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

  /* ---- Copy Wallet Address ---- */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var address = btn.getAttribute('data-address') ||
                    btn.closest('.wallet-address')?.querySelector('.wallet-address__text')?.textContent?.trim() ||
                    '';
      if (!address) return;

      navigator.clipboard.writeText(address).then(function () {
        var original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copy-btn--copied');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('copy-btn--copied');
        }, 2000);
      }).catch(function () {
        // Fallback for older browsers
        var textarea = document.createElement('textarea');
        textarea.value = address;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        var original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copy-btn--copied');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('copy-btn--copied');
        }, 2000);
      });
    });
  });

  /* ---- Trade Tabs (Buy/Sell) ---- */
  var tradeTabs = document.querySelectorAll('.trade-tab');
  var tradePanels = document.querySelectorAll('.trade-panel');

  tradeTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tradeTabs.forEach(function (t) { t.classList.remove('trade-tab--active'); });
      tradePanels.forEach(function (p) { p.classList.remove('trade-panel--active'); });

      tab.classList.add('trade-tab--active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('trade-panel--active');
    });
  });

  /* ---- Settings Tabs ---- */
  var tabBtns = document.querySelectorAll('.tabs__btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

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

  /* ---- Quick Percentage Buttons (Trade) ---- */
  document.querySelectorAll('.quick-pct').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.quick-pct').forEach(function (b) {
        b.classList.remove('quick-pct--active');
      });
      btn.classList.add('quick-pct--active');
    });
  });

  /* ---- Toggle Switches ---- */
  document.querySelectorAll('.toggle__input').forEach(function (input) {
    input.addEventListener('change', function () {
      this.setAttribute('aria-checked', this.checked);
    });
  });

  /* ---- API Key Reveal Toggle ---- */
  document.querySelectorAll('.reveal-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var keyEl = btn.closest('.api-key-row')?.querySelector('.api-key-value');
      if (!keyEl) return;

      var masked = keyEl.getAttribute('data-masked');
      var full = keyEl.getAttribute('data-full');
      if (!masked || !full) return;

      if (keyEl.textContent.includes('••')) {
        keyEl.textContent = full;
        btn.textContent = 'Hide';
      } else {
        keyEl.textContent = masked;
        btn.textContent = 'Reveal';
      }
    });
  });

  /* ---- Search Filter (Transactions) ---- */
  var txSearch = document.querySelector('.filter-bar__search-input');
  if (txSearch) {
    txSearch.addEventListener('input', function () {
      var query = txSearch.value.toLowerCase();
      var rows = document.querySelectorAll('.data-table tbody tr');
      rows.forEach(function (row) {
        var text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  /* ---- Close sidebar on resize to desktop ---- */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      closeSidebar();
    }
  });

  /* ---- Order type toggle (Limit/Market) ---- */
  document.querySelectorAll('.order-type-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.order-type-btn').forEach(function (b) {
        b.classList.remove('order-type-btn--active');
      });
      btn.classList.add('order-type-btn--active');
    });
  });
})();
