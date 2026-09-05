/* ============================================================
 * publications.js
 * ------------------------------------------------------------
 * EN: Renders the "Publications" teaser on the MAIN page
 *     (index.html, #publications-container). Only shows
 *     publications with "relevant": true, pulled from ALL the
 *     per-year files listed in data/publications-years.json,
 *     sorted newest-first, one per row. Ends with a "View all
 *     publications" link to publications.html, where every
 *     publication is listed with sorting and filters.
 *
 * ES: Renderiza el avance de "Publications" en la página
 *     PRINCIPAL (index.html, #publications-container). Solo
 *     muestra las publicaciones con "relevant": true, obtenidas
 *     de TODOS los ficheros por año listados en
 *     data/publications-years.json, ordenadas de más reciente a
 *     más antigua, una por fila. Termina con un enlace "Ver
 *     todas las publicaciones" hacia publications.html, donde se
 *     listan todas con opciones de orden y filtros.
 * ============================================================ */

import { getCurrentLang, applyTranslations } from './i18n.js';
import { sortPublications, renderPublicationRow, fetchAllPublications } from './publications-common.js';

export async function renderPublications() {
    const container = document.getElementById('publications-container');
    // EN: No publications teaser on this page -> nothing to do.
    // ES: No hay avance de publicaciones en esta página -> no hacer nada.
    if (!container) return;

    try {
        // EN: Reads data/publications-years.json, then every
        //     data/<year>/publications.json it points to.
        // ES: Lee data/publications-years.json, y luego cada
        //     data/<year>/publications.json que indique.
        const all = await fetchAllPublications();
        const lang = getCurrentLang();

        // EN: Only the ones explicitly marked as relevant.
        // ES: Solo las que están explícitamente marcadas como relevantes.
        const relevant = sortPublications(
            all.filter(p => p.relevant === true),
            'date-desc'
        );

        if (relevant.length === 0) {
            container.innerHTML = `<p class="no-items" data-i18n="publications.noItems">No publications yet.</p>`;
            applyTranslations();
            return;
        }

        container.innerHTML = `
            <div class="publication-list">
                ${relevant.map(pub => renderPublicationRow(pub, lang)).join('')}
            </div>
            <a href="publications.html" class="btn btn-secondary view-all-link" data-i18n="publications.viewAll">View all publications →</a>
        `;

        applyTranslations();
    } catch (err) {
        console.error('Failed to load publications data', err);
        container.innerHTML = `<p class="error">Unable to load publications right now.</p>`;
    }
}

// EN: Re-render on language change, same pattern as people/research/events.
// ES: Se vuelve a renderizar al cambiar de idioma, mismo patrón que people/research/events.
window.addEventListener('languageChanged', renderPublications);