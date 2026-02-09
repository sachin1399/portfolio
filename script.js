// Fade-in-Up animation on scroll
const faders = document.querySelectorAll('.fade-in-up');
function appearOnScroll() {
    faders.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            section.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', appearOnScroll);
window.addEventListener('DOMContentLoaded', appearOnScroll);

// Theme switch
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeBtn.textContent = document.body.classList.contains('light-theme') ? '🌞' : '🌙';
});

// Contact form
const contactForm = document.getElementById('contactForm');
contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Thank you! Your message was sent.");
    contactForm.reset();
});
