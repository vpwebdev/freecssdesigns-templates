/* ==========================================================================
   Galerie Lumen — Main JavaScript
   Scroll reveal, header, mobile nav, filters, spotlight hover, parallax
   ========================================================================== */

(function () {
    'use strict';

    /* --- Scroll Reveal --- */
    function initScrollReveal() {
        var elements = document.querySelectorAll('[data-reveal]');
        if (!elements.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* --- Header Scroll State --- */
    function initHeader() {
        var header = document.getElementById('header');
        if (!header) return;

        var scrolled = false;

        function onScroll() {
            var shouldBeScrolled = window.scrollY > 40;
            if (shouldBeScrolled !== scrolled) {
                scrolled = shouldBeScrolled;
                header.classList.toggle('is-scrolled', scrolled);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* --- Mobile Navigation --- */
    function initMobileNav() {
        var toggle = document.getElementById('headerToggle');
        var nav = document.getElementById('headerNav');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            toggle.classList.toggle('is-active');
            nav.classList.toggle('is-open');
            document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
        });

        // Close nav on link click
        var links = nav.querySelectorAll('.header__link');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.classList.remove('is-active');
                nav.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });

        // Close nav on escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                toggle.classList.remove('is-active');
                nav.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
    }

    /* --- Filter Tabs --- */
    function initFilterTabs() {
        var tabContainers = document.querySelectorAll('.tabs');

        tabContainers.forEach(function (container) {
            var tabs = container.querySelectorAll('.tab');
            // Find the grid that follows this tabs container
            var grid = container.nextElementSibling;
            while (grid && !grid.classList.contains('grid') && !grid.classList.contains('masonry')) {
                grid = grid.nextElementSibling;
            }
            if (!grid) return;

            tabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    var filter = this.getAttribute('data-filter');

                    // Update active tab
                    tabs.forEach(function (t) { t.classList.remove('is-active'); });
                    this.classList.add('is-active');

                    // Filter items
                    var items = grid.children;
                    Array.prototype.forEach.call(items, function (item) {
                        var category = item.getAttribute('data-category');
                        if (filter === 'all' || category === filter) {
                            item.style.display = '';
                            // Re-trigger reveal animation
                            item.classList.remove('is-revealed');
                            void item.offsetWidth; // force reflow
                            item.classList.add('is-revealed');
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        });
    }

    /* --- Artwork Spotlight Hover --- */
    function initSpotlightHover() {
        var cards = document.querySelectorAll('.artwork-card');

        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.setProperty('--spotlight-x', x + 'px');
                card.style.setProperty('--spotlight-y', y + 'px');
            });

            card.addEventListener('mouseleave', function () {
                card.style.setProperty('--spotlight-x', '50%');
                card.style.setProperty('--spotlight-y', '50%');
            });
        });
    }

    /* --- Parallax Hero --- */
    function initParallax() {
        var hero = document.querySelector('.hero');
        if (!hero) return;

        var spotlights = hero.querySelectorAll('.hero__spotlight');
        if (!spotlights.length) return;

        var ticking = false;

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var scrollY = window.scrollY;
                    var heroHeight = hero.offsetHeight;

                    if (scrollY < heroHeight) {
                        var offset = scrollY * 0.3;
                        spotlights.forEach(function (s) {
                            s.style.transform = 'translateY(' + offset + 'px)';
                        });

                        var content = hero.querySelector('.hero__content');
                        if (content) {
                            content.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
                            content.style.opacity = 1 - (scrollY / heroHeight) * 0.6;
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* --- Smooth Scroll for Anchor Links --- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gl-nav-height')) || 76;
                    var top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        });
    }

    /* --- Initialize Everything --- */
    function init() {
        initScrollReveal();
        initHeader();
        initMobileNav();
        initFilterTabs();
        initSpotlightHover();
        initParallax();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
