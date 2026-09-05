import { initI18n, applyTranslations } from './i18n.js';
import { renderAbout } from './about.js';
import { renderPeople } from './people.js';
import { renderEvents } from './events.js';
// EN: NEW — renders the "Research" topic cards from data/research.json.
// ES: NUEVO — renderiza las tarjetas de temas de "Research" a partir de data/research.json.
import { renderResearch } from './research.js';
// EN: NEW — publications teaser (index.html) and full filterable view (publications.html).
//     Both guard on their container's existence, so it's safe to call both on every page.
// ES: NUEVO — avance de publicaciones (index.html) y vista completa con filtros
//     (publications.html). Ambas comprueban que su contenedor exista, así que es
//     seguro llamarlas en cualquier página.
import { renderPublications } from './publications.js';
import { renderPublicationsAll } from './publications-all.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Dynamic Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Bulletproof Theme Setup
    const themeBtn = document.getElementById('theme-toggle');
    
    function setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
            if (themeBtn) themeBtn.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
            if (themeBtn) themeBtn.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setTheme(initialDark);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
            setTheme(!isCurrentlyDark);
        });
    }

    // 3. Mobile Navigation
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // 4. Initialize Translations & Render Components
    await initI18n();
    applyTranslations();
    renderAbout();
    renderPeople();
    renderEvents();
    // EN: Render the research topic cards (see js/research.js and data/research.json).
    // ES: Renderiza las tarjetas de temas de investigación (ver js/research.js y data/research.json).
    renderResearch();
    // EN: Render publications — the teaser on index.html, the full
    //     filterable list on publications.html (see comment above).
    // ES: Renderiza publicaciones — el avance en index.html, la
    //     lista completa con filtros en publications.html (ver comentario arriba).
    renderPublications();
    renderPublicationsAll();
});