// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Placeholder form handling — replace with a real submission handler
// (e.g. a backend endpoint, Formspree, or similar) before launch.
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('This form is not yet connected. Add a submission handler before going live.');
  });
}
