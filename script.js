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

// Flip postcards
document.querySelectorAll('.pc').forEach((card) => {
  card.addEventListener('click', () => {
    const flipped = card.classList.toggle('flip');
    card.setAttribute('aria-pressed', flipped);
  });
});

// Booking form (Formspree)
const form = document.getElementById('form');
const status = document.getElementById('status');
if (form && status) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending your booking…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error();
      status.textContent = "Booking sent! I'll get back to you within a day or two.";
      form.reset();
    } catch {
      status.textContent = "Your booking didn't go through. Please email webcreate1206@gmail.com instead.";
    }
  });
}
