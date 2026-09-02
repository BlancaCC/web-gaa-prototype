import { initI18n, applyTranslations } from './i18n.js';
import { renderAbout } from './about.js';

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Theme setup
    const themeBtn = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Mobile navigation toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('active'));

    // Close menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });

    // Initialize translations & render content
    await initI18n();
    applyTranslations();
    renderAbout();
});