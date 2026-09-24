/* =========================================
   BrightWorld LED Lights Store - script.js
   ========================================= */

'use strict';

/* ── Loading Screen ───────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 700);
    }, 1800);
  }
  // Trigger page transition
  document.body.classList.add('page-transition');
});

/* ── Dark / Light Mode Toggle ─────────────── */
const darkToggleBtn = document.getElementById('dark-toggle');
const currentTheme  = localStorage.getItem('bw-theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateToggleIcon(currentTheme);

if (darkToggleBtn) {
  darkToggleBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bw-theme', theme);
    updateToggleIcon(theme);
  });
}

function updateToggleIcon(theme) {
  if (!darkToggleBtn) return;
  darkToggleBtn.innerHTML = theme === 'dark'
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-fill"></i>';
  darkToggleBtn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

/* ── Sticky Navbar ────────────────────────── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  // Scroll to top visibility
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  }
});

/* ── Scroll To Top ────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Active Nav Link ──────────────────────── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── AOS Init ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  // Bootstrap Tooltips
  const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipEls.forEach(el => new bootstrap.Tooltip(el));

  // Bootstrap Toasts
  const toastEls = document.querySelectorAll('.toast');
  toastEls.forEach(el => new bootstrap.Toast(el));
});

/* ── Animated Counters ────────────────────── */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ── Product Filter ───────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const items  = document.querySelectorAll('.filter-item');
    items.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.display = show ? '' : 'none';
      if (show) {
        item.style.animation = 'fadeIn 0.4s ease';
      }
    });
    // Restore all section headers when clicking category filters
    document.querySelectorAll('#products-grid > .col-12, #bulbs > div.d-flex').forEach(el => {
      el.style.display = '';
    });
  });
});

// Auto-filter based on URL query parameter
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter') || urlParams.get('category');
  const brandParam = urlParams.get('brand');

  if (filterParam) {
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
    if (targetBtn) {
      setTimeout(() => {
        targetBtn.click();
      }, 100);
    }
  } else if (brandParam) {
    const brandLower = brandParam.toLowerCase().trim();
    const grid = document.getElementById('products-grid');
    if (grid) {
      const children = Array.from(grid.children);
      let currentHeader = null;
      let hasVisibleInCurrentSection = false;
      
      const bulbsHeader = document.querySelector('#bulbs > div.d-flex');
      let bulbsHasVisible = false;

      children.forEach(child => {
        if (child.classList.contains('filter-item')) {
          const brandText = (child.querySelector('.product-brand')?.textContent || '').toLowerCase().trim();
          const show = brandText === brandLower;
          child.style.display = show ? '' : 'none';
          
          if (show) {
            if (currentHeader) {
              hasVisibleInCurrentSection = true;
            } else {
              bulbsHasVisible = true;
            }
          }
        } else if (child.classList.contains('col-12') && child.id) {
          if (currentHeader) {
            currentHeader.style.display = hasVisibleInCurrentSection ? '' : 'none';
          }
          currentHeader = child;
          hasVisibleInCurrentSection = false;
        }
      });
      
      if (currentHeader) {
        currentHeader.style.display = hasVisibleInCurrentSection ? '' : 'none';
      }
      if (bulbsHeader) {
        bulbsHeader.style.display = bulbsHasVisible ? '' : 'none';
      }
    }

    // De-activate all filter buttons since we are filtering by brand
    filterBtns.forEach(btn => btn.classList.remove('active'));
  }
});


/* ── Product Search ───────────────────────── */
const productSearch = document.getElementById('product-search');
if (productSearch) {
  productSearch.addEventListener('input', () => {
    const q = productSearch.value.toLowerCase().trim();
    document.querySelectorAll('.filter-item').forEach(item => {
      const name = (item.querySelector('.product-name')?.textContent || '').toLowerCase();
      item.style.display = name.includes(q) ? '' : 'none';
    });
  });
}

/* ── Sort Products ────────────────────────── */
const sortSelect = document.getElementById('sort-select');
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    const container = document.getElementById('products-grid');
    if (!container) return;
    const items = Array.from(container.querySelectorAll('.filter-item'));
    items.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price || 0);
      const priceB = parseFloat(b.dataset.price || 0);
      const nameA  = a.querySelector('.product-name')?.textContent || '';
      const nameB  = b.querySelector('.product-name')?.textContent || '';
      if (val === 'price-asc')  return priceA - priceB;
      if (val === 'price-desc') return priceB - priceA;
      if (val === 'name-asc')   return nameA.localeCompare(nameB);
      if (val === 'name-desc')  return nameB.localeCompare(nameA);
      return 0;
    });
    items.forEach(item => container.appendChild(item));
  });
}

/* ── Cart ─────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('bw-cart') || '[]');

function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
}
updateCartCount();

function addToCart(name, price, brand) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, brand, qty: 1 });
  }
  localStorage.setItem('bw-cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`"${name}" added to cart!`);
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card, [data-product]');
    const name  = card?.querySelector('.product-name')?.textContent?.trim() || 'Product';
    const price = parseFloat(card?.dataset.price || 0);
    const brand = card?.querySelector('.product-brand')?.textContent?.trim() || '';
    addToCart(name, price, brand);

    // Button animation
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Added!';
    btn.classList.add('btn-success');
    btn.classList.remove('btn-primary-grad');
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.classList.remove('btn-success');
      btn.classList.add('btn-primary-grad');
    }, 1500);
  });
});

/* ── Toast Notification ───────────────────── */
function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:80px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: var(--dark-card, #1a1d30);
    border: 1px solid ${type === 'success' ? 'rgba(10,132,255,0.35)' : 'rgba(255,71,87,0.35)'};
    color: var(--text-main, #f0f4ff);
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.35);
    animation: fadeInUp 0.35s ease forwards;
    min-width: 220px;
  `;
  toast.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}" style="color:${type === 'success' ? 'var(--primary)' : '#ff4757'}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

/* ── Gallery Lightbox ─────────────────────── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lightbox-img');
const lbClose  = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
  item.addEventListener('click', () => {
    if (!lightbox || !lbImg) return;
    lbImg.src = item.dataset.src;
    lbImg.alt = item.dataset.alt || 'Gallery Image';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

if (lbClose) {
  lbClose.addEventListener('click', closeLightbox);
}
if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── Feedback Form ────────────────────────── */
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', e => {
    e.preventDefault();
    const alert = document.getElementById('feedback-success');
    if (alert) {
      alert.style.display = 'block';
      alert.style.animation = 'fadeInUp 0.5s ease';
    }
    feedbackForm.reset();
    // Reset star rating
    document.querySelectorAll('.star-rating input').forEach(i => i.checked = false);
    setTimeout(() => {
      if (alert) alert.style.display = 'none';
    }, 4000);
  });
}

/* ── Query Form ───────────────────────────── */
const queryForm = document.getElementById('query-form');
if (queryForm) {
  queryForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Your query has been submitted! We\'ll respond within 24 hours.');
    queryForm.reset();
  });
}

/* ── Contact Form ─────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent! We\'ll get back to you soon.');
    contactForm.reset();
  });
}

/* ── Newsletter Form ──────────────────────── */
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Successfully subscribed! Check your email for confirmation.');
    newsletterForm.reset();
  });
}

/* ── Progress Bar Animation ───────────────── */
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.progress-bar');
      if (bar) {
        const width = bar.dataset.width || '0%';
        bar.style.width = width;
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar').forEach(bar => {
  progressObserver.observe(bar);
});

/* ── Carousel Auto ────────────────────────── */
const heroCarousel = document.getElementById('heroCarousel');
if (heroCarousel) {
  new bootstrap.Carousel(heroCarousel, { interval: 5000, pause: 'hover' });
}

/* ── Smooth Scroll for Anchor Links ──────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Lazy Load Images ─────────────────────── */
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));
}

/* ── Star Rating ──────────────────────────── */
document.querySelectorAll('.star-label').forEach(label => {
  label.addEventListener('mouseenter', () => {
    const val  = parseInt(label.dataset.star);
    const all  = label.closest('.star-rating').querySelectorAll('.star-label i');
    all.forEach((i, idx) => {
      i.className = idx < val ? 'bi bi-star-fill' : 'bi bi-star';
      i.style.color = idx < val ? 'var(--accent)' : 'var(--text-dim)';
    });
  });
});
