/* ========================================
   SANCTUM CHURCH - MAIN JAVASCRIPT
   Navigation, Animations, Interactions
======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
  initSmoothScroll();
  initCurrentYear();
});

/* =====================
   MOBILE NAVIGATION
===================== */
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
  
  if (!menuToggle || !mobileNav) return;
  
  let isOpen = false;
  
  function toggleMenu() {
    isOpen = !isOpen;
    menuToggle.classList.toggle('menu-toggle--open', isOpen);
    mobileNav.classList.toggle('mobile-nav--open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  
  menuToggle.addEventListener('click', toggleMenu);
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  });
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) toggleMenu();
  });
}

/* =====================
   HEADER SCROLL BEHAVIOR
===================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  const isTransparentHeader = header.classList.contains('header--transparent');
  
  function updateHeader() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const scrolledPastHero = currentScrollY > window.innerHeight * 0.5;
    
    // Hide/show header on scroll
    if (scrollingDown && currentScrollY > 100) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }
    
    // Change header background when scrolled
    if (isTransparentHeader) {
      if (scrolledPastHero) {
        header.classList.remove('header--transparent');
        header.classList.add('header--scrolled');
      } else {
        header.classList.add('header--transparent');
        header.classList.remove('header--scrolled');
      }
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

/* =====================
   SCROLL REVEAL ANIMATION
===================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!revealElements.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  revealElements.forEach(el => observer.observe(el));
}

/* =====================
   SMOOTH SCROLL FOR ANCHORS
===================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* =====================
   CURRENT YEAR FOR COPYRIGHT
===================== */
function initCurrentYear() {
  const yearElement = document.querySelector('.current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* =====================
   FORM HANDLING
===================== */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    if (!isValid) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      alert('Thank you for your message. We will be in touch soon.');
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

/* =====================
   IMAGE LAZY LOADING
===================== */
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (!lazyImages.length) return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

/* =====================
   UTILITY FUNCTIONS
===================== */

// Throttle function for performance
function throttle(func, wait) {
  let timeout = null;
  let previous = 0;
  
  return function(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
