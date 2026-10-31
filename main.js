/* ===========================
   NAV — scroll & mobile toggle
=========================== */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav__links');

// Overlay for mobile menu
const overlay = document.createElement('div');
overlay.className = 'nav__overlay';
document.body.appendChild(overlay);

// Sticky nav on scroll
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// Toggle mobile menu
function toggleMenu(open) {
  navToggle.classList.toggle('open', open);
  navLinks.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

navToggle.addEventListener('click', () => {
  toggleMenu(!navLinks.classList.contains('open'));
});

overlay.addEventListener('click', () => toggleMenu(false));

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

/* ===========================
   ACTIVE NAV LINK
=========================== */
const sections = document.querySelectorAll('section[id]');

new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.querySelectorAll('a').forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
        });
      }
    });
  },
  { rootMargin: '-50% 0px -50% 0px' }
).observe && sections.forEach(s =>
  new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.querySelectorAll('a').forEach(a => {
            a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  ).observe(s)
);

/* ===========================
   SCROLL REVEAL
=========================== */
function initReveal() {
  // Add reveal class to key elements that don't already have it in HTML
  [
    '.section__title',
    '.about__text',
    '.about__stats',
    '.contact__info',
    '.contact__form',
    '.hero__content',
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger delay based on index among siblings
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.08}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===========================
   SKILL BAR ANIMATION
=========================== */
function initSkillBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-width');
          setTimeout(() => {
            entry.target.style.width = width + '%';
          }, 250);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.skill-item__fill').forEach(bar => observer.observe(bar));
}

/* ===========================
   TYPEWRITER — hero role
=========================== */
function initTypewriter() {
  const roles = [
    'Customer Service',
    'Management Graduate',
    'Pemecah Masalah',
    'Tim Player',
  ];

  const el = document.querySelector('.hero__role');
  if (!el) return;

  // Add blinking cursor via CSS
  const style = document.createElement('style');
  style.textContent = `
    .hero__role {
      border-right: 2px solid var(--accent-light);
      padding-right: 3px;
      animation: blink 0.75s step-end infinite;
    }
    @keyframes blink {
      0%, 100% { border-color: var(--accent-light); }
      50% { border-color: transparent; }
    }
  `;
  document.head.appendChild(style);

  let roleIdx = 0, charIdx = 0, deleting = false, paused = false;

  function tick() {
    const current = roles[roleIdx];

    if (paused) {
      paused = false;
      setTimeout(tick, 1600);
      return;
    }

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) { deleting = true; paused = true; }
      setTimeout(tick, 85);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
      setTimeout(tick, 48);
    }
  }

  setTimeout(tick, 900);
}

/* ===========================
   STAT COUNTER ANIMATION
=========================== */
function initCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent;
        const numStr = raw.replace(/[^0-9.]/g, '');
        const suffix = raw.replace(/[0-9.]/g, '');
        const target = parseFloat(numStr);
        const isDecimal = numStr.includes('.');
        const duration = 1000;
        const steps = 40;
        const interval = duration / steps;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const value = target * eased;
          el.textContent = (isDecimal ? value.toFixed(2) : Math.round(value)) + suffix;
          if (step >= steps) {
            el.textContent = raw; // restore original
            clearInterval(timer);
          }
        }, interval);

        observer.unobserve(el);
      });
    },
    { threshold: 0.7 }
  );

  document.querySelectorAll('.stat__number').forEach(el => observer.observe(el));
}

/* ===========================
   CONTACT FORM
=========================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.className = 'form__status';
    status.textContent = '';

    let valid = true;
    form.querySelectorAll('input, textarea').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
      if (field.type === 'email' && field.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
          field.classList.add('error');
          valid = false;
        }
      }
    });

    if (!valid) {
      status.textContent = 'Mohon isi semua field dengan benar.';
      status.classList.add('error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Mengirim...';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Kirim Pesan';
      form.reset();
      status.textContent = '✓ Pesan terkirim! Saya akan segera membalas.';
      status.classList.add('success');
      setTimeout(() => {
        status.textContent = '';
        status.className = 'form__status';
      }, 5000);
    }, 1400);
  });

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

/* ===========================
   INIT
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSkillBars();
  initTypewriter();
  initCounters();
  initContactForm();
});
