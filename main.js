// ========================
// AETHER EDITING — MAIN.JS
// ========================

// ========================
// CONFIGURATION
// ========================
const CONFIG = {
  NAV_SCROLL_THRESHOLD: 40,
  REVEAL_STAGGER_DELAY: 80,
  REVEAL_THRESHOLD: 0.12,
  FORM_ANIMATION_DURATION: 300,
  SHAKE_DURATION: 600,
  REVEAL_ROOT_MARGIN: '0px 0px -40px 0px',
};

// ========================
// UTILITY FUNCTIONS
// ========================

function injectShakeKeyframe() {
  if (document.getElementById('shake-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'shake-keyframes';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(name, email, message, service) {
  const errors = [];
  if (!name?.trim()) errors.push('name');
  if (!email?.trim() || !isValidEmail(email)) errors.push('email');
  if (!message?.trim()) errors.push('message');
  if (!service?.trim()) errors.push('service');
  return errors;
}

function highlightFormErrors(errorFields) {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    if (errorFields.includes(el.id)) el.classList.add('error-shake');
  });
  setTimeout(() => {
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      el.classList.remove('error-shake');
    });
  }, CONFIG.SHAKE_DURATION);
}

// ========================
// NAV SCROLL
// ========================
let scrollTicking = false;
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > CONFIG.NAV_SCROLL_THRESHOLD);
      }
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// ========================
// HAMBURGER / MOBILE MENU
// ========================
function closeMenu() {
  document.getElementById('hamburger')?.classList.remove('open');
  document.getElementById('mobileOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ========================
// REVEAL ON SCROLL
// ========================
const revealEls = document.querySelectorAll('.reveal');
const siblingCache = new Map();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      if (!siblingCache.has(parent)) {
        siblingCache.set(parent, [...parent.querySelectorAll('.reveal')]);
      }
      const siblings = siblingCache.get(parent);
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * CONFIG.REVEAL_STAGGER_DELAY);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: CONFIG.REVEAL_THRESHOLD,
  rootMargin: CONFIG.REVEAL_ROOT_MARGIN,
});

revealEls.forEach((el) => observer.observe(el));

// ========================
// PORTFOLIO FILTER
// ========================
const portContainer = document.querySelector('[data-portfolio-container]');

if (portContainer) {
  document.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');
    if (!filterBtn) return;
    document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
    filterBtn.classList.add('active');
    const filter = filterBtn.dataset.filter;
    document.querySelectorAll('.port-card').forEach((card) => {
      const cats = card.dataset.cat || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
}

// ========================
// CONTACT FORM
// ========================
if (typeof emailjs !== 'undefined') {
  emailjs.init("fFPxg6eAkPAimBZiK");
}

async function submitForm() {
  try {
    const name    = document.getElementById('name')?.value;
    const email   = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;
    const service = document.getElementById('service')?.value;
    const budget  = document.getElementById('budget')?.value;

    const errors = validateForm(name, email, message, service);
    if (errors.length > 0) {
      highlightFormErrors(errors);
      return;
    }

    await emailjs.send("service_qkitbvv", "template_0ww6gpf", {
      name, email, message, service, budget
    });

    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (form && success) {
      form.style.opacity = '0';
      form.style.transform = 'translateY(8px)';
      form.style.transition = `all ${CONFIG.FORM_ANIMATION_DURATION}ms ease`;
      setTimeout(() => {
        form.style.display = 'none';
        success.classList.remove('hidden');
      }, CONFIG.FORM_ANIMATION_DURATION);
    }
  } catch (error) {
    console.error('Form submission error:', error);
    alert("Something went wrong. Please try again.");
  }
}

// ========================
// FAQ TOGGLE
// ========================
function toggleFaq(item) {
  if (!item?.classList) return;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ========================
// INITIALIZATION
// ========================
function initializeApp() {
  try {
    injectShakeKeyframe();

    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobileOverlay');

    hamburger?.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileOverlay?.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    console.log('Aether app initialized');
  } catch (error) {
    console.error('App initialization error:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
