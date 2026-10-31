document.documentElement.classList.add('js');
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu
const burger = document.querySelector('.burger');
const menu = document.querySelector('.links');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
}

// Play the little animations when a card scrolls into view
function play(el) {
  el.classList.add('play');

  // likes count up
  const heart = el.querySelector('.heart');
  if (heart && !calm) {
    let n = 0;
    const tick = setInterval(() => {
      n += 8;
      heart.textContent = '+' + Math.min(n, 128);
      if (n >= 128) clearInterval(tick);
    }, 40);
  }

  // typing… then the auto-reply
  const typing = el.querySelector('.bub.typing');
  if (typing) setTimeout(() => { typing.style.display = 'none'; }, calm ? 0 : 1800);

  // checklist ticks itself off one by one
  const items = el.querySelectorAll('.mini-check li');
  if (items.length && !calm) {
    items.forEach((li) => li.classList.remove('done'));
    items.forEach((li, i) => {
      if (i < items.length - 1) setTimeout(() => li.classList.add('done'), 500 + i * 650);
    });
  }
}
const watched = document.querySelectorAll('.svc, .proc');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { play(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.35 });
  watched.forEach((el) => io.observe(el));
} else {
  watched.forEach(play);
}

// Drag the photo and sticky note around
document.querySelectorAll('[data-drag]').forEach((el) => {
  let startX, startY, baseX = 0, baseY = 0, dragging = false;
  const baseRot = el.classList.contains('sticky') ? ' rotate(-6deg)' : '';
  el.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-drag]') !== el) return;
    e.stopPropagation();
    dragging = true;
    startX = e.clientX - baseX;
    startY = e.clientY - baseY;
    el.classList.add('dragging');
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    baseX = e.clientX - startX;
    baseY = e.clientY - startY;
    el.style.transform = `translate(${baseX}px, ${baseY}px)` + baseRot;
  });
  const stop = () => { dragging = false; el.classList.remove('dragging'); };
  el.addEventListener('pointerup', stop);
  el.addEventListener('pointercancel', stop);
});

// The "you?" cursor follows the visitor's mouse inside the closing box
const box = document.querySelector('.cta-box');
const you = box && box.querySelector('.cursor.you');
if (box && you && !calm && window.matchMedia('(hover: hover)').matches) {
  box.addEventListener('pointermove', (e) => {
    const r = box.getBoundingClientRect();
    you.style.left = (e.clientX - r.left + 6) + 'px';
    you.style.top = (e.clientY - r.top + 6) + 'px';
    you.style.right = 'auto';
  });
}

// Confetti
function confetti() {
  if (calm) return;
  const colors = ['#6CC4F7', '#F2668B', '#FFD25E', '#4FD1A5', '#10243E'];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[i % colors.length];
    c.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
    c.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
    c.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
    c.style.animationDelay = Math.random() * 0.4 + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

// Contact form (Formspree)
const form = document.getElementById('form');
const status = document.getElementById('status');
if (form && status) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error();
      status.textContent = "Message sent! I'll get back to you within a day or two.";
      form.reset();
      confetti();
    } catch {
      status.textContent = "Your message didn't go through. Please email webcreate1206@gmail.com instead.";
    }
  });
}
