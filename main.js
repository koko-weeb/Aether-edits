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

/**
 * Inject shake keyframe animation if not already present
 */
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

/**
 * Validate email format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate form fields
 * @returns {string[]} Array of invalid field IDs
 */
function validateForm(name, email, message, service) {
  const errors = [];
  if (!name?.trim()) errors.push('name');
  if (!email?.trim() || !isValidEmail(email)) errors.push('email');
  if (!message?.trim()) errors.push('message');
  if (!service?.trim()) errors.push('service');
  return errors;
}

/**
 * Highlight form errors with shake animation
 */
function highlightFormErrors(errorFields) {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.querySelectorAll('input, select, textarea').forEach((el) => {
    if (errorFields.includes(el.id)) {
      el.classList.add('error-shake');
    }
  });

  setTimeout(() => {
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      el.classList.remove('error-shake');
    });
  }, CONFIG.SHAKE_DURATION);
}

// ========================
// NAV SCROLL WITH THROTTLE
// ========================
let scrollTicking = false;
const nav = document.getElementById('nav');

window.addEventListener(
  'scroll',
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        if (nav) {
          nav.classList.toggle('scrolled', window.scrollY > CONFIG.NAV_SCROLL_THRESHOLD);
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  },
  { passive: true }
);

// ========================
// HAMBURGER / MOBILE MENU
// ========================
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');

function closeMenu() {
  hamburger?.classList.remove('open');
  mobileOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileOverlay?.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close overlay on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ========================
// REVEAL ON SCROLL (OPTIMIZED)
// ========================
const revealEls = document.querySelectorAll('.reveal');
const siblingCache = new Map();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;

        // Cache siblings to avoid recalculating on every intersection
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
  },
  {
    threshold: CONFIG.REVEAL_THRESHOLD,
    rootMargin: CONFIG.REVEAL_ROOT_MARGIN,
  }
);

revealEls.forEach((el) => observer.observe(el));

// ========================
// PORTFOLIO FILTER (EVENT DELEGATION)
// ========================
const portContainer = document.querySelector('[data-portfolio-container]');

if (portContainer) {
  // Buttons live in .filter-bar (outside the grid), so delegate from document.
  document.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');
    if (!filterBtn) return;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    filterBtn.classList.add('active');

    // Filter portfolio cards
    const filter = filterBtn.dataset.filter;
    document.querySelectorAll('.port-card').forEach((card) => {
      const cats = card.dataset.cat || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
}

// ========================
// CONTACT FORM SUBMISSION
// ========================
emailjs.init("fFPxg6eAkPAimBZiK");
async function submitForm() {  
  try {
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;
    const service = document.getElementById('service')?.value;
    const budget = document.getElementById('budget')?.value;  // 👈 budget bhi add karo

    const errors = validateForm(name, email, message, service);
    if (errors.length > 0) {
      highlightFormErrors(errors);
      return;
    }

    // 👇 TODO wali line hatao, ye daalo
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
    alert("Something went wrong. Please try again.");  // 👈 user ko bhi batao
  }
}

// ========================
// FAQ TOGGLE
// ========================
function toggleFaq(item) {
  if (!item?.classList) return;

  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach((i) => {
    i.classList.remove('open');
  });

  if (!isOpen) {
    item.classList.add('open');
  }
}

// ========================
// INITIALIZATION
// ========================
function initializeApp() {
  try {
    injectShakeKeyframe();
    console.log('Aether app initialized');
  } catch (error) {
    console.error('App initialization error:', error);
  }
}
document.querySelectorAll('.vimeo-thumb').forEach(thumb => {
  const id = thumb.dataset.vimeoId;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://player.vimeo.com/video/${id}?autopause=0&muted=1&loop=1&controls=0`;
  iframe.allow = "autoplay; fullscreen; picture-in-picture";
  thumb.prepend(iframe);

  // Init Vimeo player
  const player = new Vimeo.Player(iframe);
  player.setVolume(0);

  thumb.addEventListener('mouseenter', () => {
    player.play();
    thumb.classList.add('playing');
  });

  thumb.addEventListener('mouseleave', () => {
    player.pause();
    thumb.classList.remove('playing');
  });

  // Click = fullscreen
  thumb.addEventListener('click', () => {
    player.requestFullscreen();
  });
});

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
