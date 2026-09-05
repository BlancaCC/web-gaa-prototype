/* ============================================================
 * research.js
 * ------------------------------------------------------------
 * EN: Renders the "Research" section (the topic cards, e.g.
 *     "Generative AI", "Kernel Methods", ...) from a single
 *     JSON file: data/research.json.
 *     To add / edit / remove a topic you only need to touch
 *     that JSON file — no changes to this file are required.
 *
 * ES: Renderiza la sección "Research" (las tarjetas de temas,
 *     p. ej. "IA Generativa", "Métodos de Núcleo", ...) a partir
 *     de un único fichero JSON: data/research.json.
 *     Para añadir, editar o eliminar un tema solo hay que tocar
 *     ese fichero JSON — no es necesario modificar este fichero.
 * ============================================================ */

import { getCurrentLang, applyTranslations } from './i18n.js';

/*
 * EN: Small helper that resolves a "bilingual field".
 *     A field can be:
 *       - a plain string                -> returned as-is
 *       - an object { en: "...", es: "..." } -> returns the
 *         value for the current language, falling back to
 *         English if the current language is missing, and to
 *         an empty string if nothing is found.
 *
 * ES: Pequeña ayuda que resuelve un "campo bilingüe".
 *     Un campo puede ser:
 *       - una cadena de texto simple      -> se devuelve tal cual
 *       - un objeto { en: "...", es: "..." } -> se devuelve el
 *         valor del idioma actual, usando inglés como
 *         alternativa si falta el idioma actual, y una cadena
 *         vacía si no se encuentra nada.
 */
const t = (field, lang) => {
    if (typeof field === 'string') return field;
    return field?.[lang] || field?.['en'] || '';
};

/*
 * EN: Builds the HTML for a single topic card.
 * ES: Construye el HTML de una única tarjeta de tema.
 */
const renderCard = (item, lang) => {
    return `
        <div class="card research-card">
            <div class="research-icon" aria-hidden="true">${item.icon || '🔬'}</div>
            <h3 class="research-topic">${t(item.topic, lang)}</h3>
            <p class="research-description">${t(item.description, lang)}</p>
        </div>
    `;
};

/*
 * EN: Main entry point. Fetches data/research.json, builds the
 *     grid of cards and injects it into #research-container.
 *     Called once on page load (see app.js) and again every
 *     time the language changes (see the event listener below).
 *
 * ES: Punto de entrada principal. Obtiene data/research.json,
 *     construye la rejilla de tarjetas y la inserta en
 *     #research-container. Se llama una vez al cargar la
 *     página (ver app.js) y de nuevo cada vez que cambia el
 *     idioma (ver el listener del evento más abajo).
 */
export async function renderResearch() {
    const container = document.getElementById('research-container');
    // EN: If this page doesn't have a research section, do nothing.
    // ES: Si esta página no tiene sección de research, no hacer nada.
    if (!container) return;

    try {
        // EN: `data/research.json` is resolved relative to index.html.
        // ES: `data/research.json` se resuelve en relación a index.html.
        const res = await fetch('data/research.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const topics = await res.json();
        const lang = getCurrentLang();

        if (!Array.isArray(topics) || topics.length === 0) {
            // EN: Friendly empty state instead of a blank section.
            // ES: Mensaje amistoso en lugar de una sección en blanco.
            container.innerHTML = `<p class="no-items">No research topics yet.</p>`;
            return;
        }

        container.innerHTML = `
            <div class="research-grid">
                ${topics.map(item => renderCard(item, lang)).join('')}
            </div>
        `;

        // EN: Re-apply data-i18n translations (for static labels, if any
        //     are added inside the section in the future).
        // ES: Vuelve a aplicar las traducciones data-i18n (para etiquetas
        //     estáticas, por si en el futuro se añaden dentro de la sección).
        applyTranslations();
    } catch (err) {
        console.error('Failed to load research data', err);
        container.innerHTML = `<p class="error">Unable to load research topics right now.</p>`;
    }
}

/*
 * EN: Re-render automatically whenever the user switches language
 *     (the same pattern used by people.js / events.js), so the
 *     descriptions update without a page reload.
 *
 * ES: Se vuelve a renderizar automáticamente cuando el usuario
 *     cambia de idioma (el mismo patrón usado en people.js /
 *     events.js), para que las descripciones se actualicen sin
 *     recargar la página.
 */
window.addEventListener('languageChanged', renderResearch);