// ========================
// AETHER EDITING — MAIN.JS
// ========================

// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// HAMBURGER / MOBILE MENU
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

// Close overlay on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// REVEAL ON SCROLL
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger by index among siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// PORTFOLIO FILTER
const filterBtns = document.querySelectorAll('.filter-btn');
const portCards = document.querySelectorAll('.port-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    portCards.forEach(card => {
      const cats = card.dataset.cat || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

// CONTACT FORM
function submitForm() {
  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();
  const service = document.getElementById('service')?.value;

  if (!name || !email || !message || !service) {
    // Simple shake animation on empty fields
    const form = document.getElementById('contactForm');
    form?.querySelectorAll('input, select, textarea').forEach(el => {
      if (!el.value.trim()) {
        el.style.borderColor = '#ef4444';
        el.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
          el.style.animation = '';
          el.style.borderColor = '';
        }, 600);
      }
    });
    return;
  }

  // Simulate send (replace with real form submission)
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form && success) {
    form.style.opacity = '0';
    form.style.transform = 'translateY(8px)';
    form.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.remove('hidden');
    }, 300);
  }
}

// FAQ TOGGLE
function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Shake keyframe (injected)
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}`;
document.head.appendChild(style);
