// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
