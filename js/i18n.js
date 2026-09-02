let currentLang = localStorage.getItem('lang') || 'en';
let translations = {};

export function getCurrentLang() {
    return currentLang;
}

export async function initI18n() {
    await loadTranslations(currentLang);
    
    const switcher = document.getElementById('lang-switcher');
    if (switcher) {
        switcher.value = currentLang;
        switcher.addEventListener('change', async (e) => {
            currentLang = e.target.value;
            localStorage.setItem('lang', currentLang);
            await loadTranslations(currentLang);
            applyTranslations();
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
        });
    }
}

async function loadTranslations(lang) {
    const res = await fetch(`data/i18n/${lang}.json`);
    translations = await res.json();
}

export function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = key.split('.').reduce((obj, i) => obj ? obj[i] : null, translations);
        if (text) el.textContent = text;
    });
}