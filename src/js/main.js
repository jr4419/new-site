// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Homepage office gallery
//
// Fades between the photos inside [data-gallery]. Without this script the
// first photo just shows on its own, so nothing breaks if JS fails to load.
// - Advances every 5 seconds, but pauses while the visitor hovers over it,
//   is using the arrows/dots with the keyboard, or has the tab in the
//   background.
// - Never auto-advances for visitors who've asked their device to reduce
//   motion; they can still step through with the arrows.
// - Supports left/right swipe on phones and arrow keys on desktop.
// ---------------------------------------------------------------------------
document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const slides = Array.from(gallery.querySelectorAll('.gallery-slide'));
  if (slides.length < 2) return;

  const prev = gallery.querySelector('.gallery-prev');
  const next = gallery.querySelector('.gallery-next');
  const dotsWrap = gallery.querySelector('.gallery-dots');
  const INTERVAL = 5000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  let timer = null;
  let paused = false;

  // Build one dot per photo.
  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot';
    const caption = slide.querySelector('figcaption');
    dot.setAttribute('aria-label', `Show photo ${i + 1}${caption ? ': ' + caption.textContent.trim() : ''}`);
    dot.addEventListener('click', () => { show(i); restart(); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, n) => {
      const active = n === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${n + 1} of ${slides.length}`);
    });
    dots.forEach((dot, n) => {
      if (n === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }
  function start() {
    if (reduceMotion || paused || document.hidden) return;
    stop();
    timer = setInterval(() => show(index + 1), INTERVAL);
  }
  function restart() { stop(); start(); }

  prev.addEventListener('click', () => { show(index - 1); restart(); });
  next.addEventListener('click', () => { show(index + 1); restart(); });

  // Pause while hovered or while keyboard focus is inside the gallery.
  gallery.addEventListener('mouseenter', () => { paused = true; stop(); });
  gallery.addEventListener('mouseleave', () => { paused = false; start(); });
  gallery.addEventListener('focusin', () => { paused = true; stop(); });
  gallery.addEventListener('focusout', (e) => {
    if (!gallery.contains(e.relatedTarget)) { paused = false; start(); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  // Arrow keys when focus is on one of the gallery's buttons.
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { show(index - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(index + 1); e.preventDefault(); }
  });

  // Swipe on touch screens.
  let touchX = null;
  gallery.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  gallery.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 40) {
      show(dx < 0 ? index + 1 : index - 1);
      restart();
    }
  }, { passive: true });

  // Switch the gallery on.
  prev.hidden = false;
  next.hidden = false;
  dotsWrap.hidden = false;
  gallery.classList.add('is-ready');
  show(0);
  start();
});

// ---------------------------------------------------------------------------
// Consultation request form
//
// The form posts to Formspree (see FORM-SETUP.md). Posting with fetch instead
// of a normal form submit keeps the patient on the page and lets us show a
// confirmation in place, rather than bouncing them to formspree.io.
// ---------------------------------------------------------------------------
const form = document.querySelector('.contact-form');

if (form) {
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button ? button.textContent : '';

  function showStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
    status.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const endpoint = form.getAttribute('action') || '';

    // Safety net: if the Formspree ID was never filled in, say so plainly
    // instead of appearing to send and quietly dropping the request.
    if (!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1) {
      showStatus(
        'This form is not connected yet. Please call the office to reach us.',
        true
      );
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        showStatus(
          'Thank you — your request has been sent. Someone from the office will be in touch soon.',
          false
        );
      } else {
        const data = await response.json().catch(() => ({}));
        const detail =
          data && data.errors
            ? data.errors.map((e) => e.message).join(' ')
            : 'Your request could not be sent. Please call the office instead.';
        showStatus(detail, true);
      }
    } catch (error) {
      showStatus(
        'Your request could not be sent — please check your connection, or call the office instead.',
        true
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = buttonLabel;
      }
    }
  });
}
