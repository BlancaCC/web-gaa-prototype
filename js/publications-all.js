/* ============================================================
 * publications-all.js
 * ------------------------------------------------------------
 * EN: Powers the FULL publications view (publications.html).
 *     Shows every entry across ALL the per-year files listed in
 *     data/publications-years.json (not just the relevant ones),
 *     one per row, with:
 *       - free-text search (title / authors / venue)
 *       - a year filter
 *       - a type filter (journal, conference, ...)
 *       - a tag filter
 *       - a sort order (newest first / oldest first / title A-Z)
 *     The filter dropdowns are built automatically from whatever
 *     years/types/tags exist in the data — you never need to
 *     edit this file when you add a new publication, year, type
 *     or tag.
 *
 * ES: Controla la vista COMPLETA de publicaciones
 *     (publications.html). Muestra todas las entradas de TODOS
 *     los ficheros por año listados en
 *     data/publications-years.json (no solo las relevantes), una
 *     por fila, con:
 *       - búsqueda libre (título / autores / revista)
 *       - filtro por año
 *       - filtro por tipo (revista, congreso, ...)
 *       - filtro por etiqueta
 *       - orden (más recientes primero / más antiguas primero /
 *         título A-Z)
 *     Los desplegables de filtro se construyen automáticamente a
 *     partir de los años/tipos/etiquetas que existan en los datos
 *     — nunca hace falta tocar este fichero al añadir una nueva
 *     publicación, año, tipo o etiqueta.
 * ============================================================ */

import { getCurrentLang, applyTranslations } from './i18n.js';
import { sortPublications, renderPublicationRow, typeLabel, fetchAllPublications } from './publications-common.js';

// EN: Kept in module scope so language changes / filter changes
//     can all re-render from the same source without re-fetching.
// ES: Se guarda en el ámbito del módulo para que los cambios de
//     idioma / filtro puedan volver a renderizar desde la misma
//     fuente sin volver a descargar el fichero.
let allPublications = [];

const els = {};

function collectFilterOptions() {
    const years = new Set();
    const types = new Set();
    const tags = new Set();

    allPublications.forEach(p => {
        if (p.year) years.add(p.year);
        if (p.type) types.add(p.type);
        (p.tags || []).forEach(tag => tags.add(tag));
    });

    return {
        years: [...years].sort((a, b) => b - a),      // EN: newest year first / ES: año más reciente primero
        types: [...types].sort(),
        tags: [...tags].sort((a, b) => a.localeCompare(b)),
    };
}

function populateSelect(select, values, lang, { withTypeLabels = false } = {}) {
    // EN: Keep the first "All ..." option, rebuild the rest.
    // ES: Mantiene la primera opción "Todos/as ..." y reconstruye el resto.
    const firstOption = select.querySelector('option');
    select.innerHTML = '';
    if (firstOption) select.appendChild(firstOption);

    values.forEach(value => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = withTypeLabels ? typeLabel(value, lang) : value;
        select.appendChild(opt);
    });
}

function applyFiltersAndRender() {
    const lang = getCurrentLang();
    const query = (els.search.value || '').trim().toLowerCase();
    const year = els.year.value;
    const type = els.type.value;
    const tag = els.tag.value;
    const sortMode = els.sort.value;

    let filtered = allPublications.filter(p => {
        if (year && String(p.year) !== year) return false;
        if (type && p.type !== type) return false;
        if (tag && !(p.tags || []).includes(tag)) return false;

        if (query) {
            const haystack = [
                p.title,
                Array.isArray(p.authors) ? p.authors.join(' ') : p.authors,
                p.venue,
            ].filter(Boolean).join(' ').toLowerCase();
            if (!haystack.includes(query)) return false;
        }

        return true;
    });

    filtered = sortPublications(filtered, sortMode);

    if (filtered.length === 0) {
        els.container.innerHTML = `<p class="no-items" data-i18n="publications.noResults">No publications match your filters.</p>`;
    } else {
        els.container.innerHTML = `
            <div class="publication-list">
                ${filtered.map(pub => renderPublicationRow(pub, lang)).join('')}
            </div>
        `;
    }
    applyTranslations();
}

export async function renderPublicationsAll() {
    const container = document.getElementById('publications-all-container');
    // EN: Not on this page -> nothing to do.
    // ES: No está en esta página -> no hacer nada.
    if (!container) return;

    els.container = container;
    els.search = document.getElementById('pub-search');
    els.year = document.getElementById('pub-filter-year');
    els.type = document.getElementById('pub-filter-type');
    els.tag = document.getElementById('pub-filter-tag');
    els.sort = document.getElementById('pub-sort');

    // EN: fetchAllPublications() reads data/publications-years.json
    //     and every data/<year>/publications.json it lists, and
    //     caches the result — so re-runs of this function (e.g.
    //     after a language change) don't re-fetch from the network.
    // ES: fetchAllPublications() lee data/publications-years.json y
    //     cada data/<year>/publications.json que indique, y
    //     guarda el resultado en caché — así las siguientes
    //     llamadas a esta función (p. ej. tras un cambio de idioma)
    //     no vuelven a descargar de la red.
    try {
        allPublications = await fetchAllPublications();
    } catch (err) {
        console.error('Failed to load publications data', err);
        container.innerHTML = `<p class="error">Unable to load publications right now.</p>`;
        return;
    }

    const lang = getCurrentLang();
    const { years, types, tags } = collectFilterOptions();
    populateSelect(els.year, years, lang);
    populateSelect(els.type, types, lang, { withTypeLabels: true });
    populateSelect(els.tag, tags, lang);

    // EN: Wire up the controls once. Safe to call this function
    //     again (language change) because we don't re-add listeners
    //     — `applyFiltersAndRender` is idempotent.
    // ES: Conecta los controles una sola vez. Es seguro volver a
    //     llamar a esta función (cambio de idioma) porque no se
    //     vuelven a añadir listeners — `applyFiltersAndRender` es
    //     idempotente.
    if (!els.wired) {
        [els.search].forEach(el => el.addEventListener('input', applyFiltersAndRender));
        [els.year, els.type, els.tag, els.sort].forEach(el => el.addEventListener('change', applyFiltersAndRender));
        els.wired = true;
    }

    applyFiltersAndRender();
}

window.addEventListener('languageChanged', renderPublicationsAll);