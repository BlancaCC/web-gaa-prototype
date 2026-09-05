/* ============================================================
 * publications-common.js
 * ------------------------------------------------------------
 * EN: Shared helpers for rendering publications, used by BOTH:
 *       - js/publications.js       (teaser on the main page,
 *         only the ones marked "relevant": true)
 *       - js/publications-all.js   (the full, filterable list
 *         on publications.html)
 *     Keeping this logic in one place means a publication looks
 *     and behaves the same in both views.
 *
 * ES: Ayudas compartidas para renderizar publicaciones, usadas
 *     TANTO por:
 *       - js/publications.js       (avance en la página
 *         principal, solo las marcadas como "relevant": true)
 *       - js/publications-all.js   (la lista completa y con
 *         filtros de publications.html)
 *     Tener esta lógica en un solo sitio hace que una
 *     publicación se vea y se comporte igual en ambas vistas.
 * ============================================================ */

/*
 * EN: Resolves a "bilingual field" — a plain string, or an
 *     object { en: "...", es: "..." } — for the given language.
 *     Falls back to English, then to an empty string.
 * ES: Resuelve un "campo bilingüe" — una cadena simple, o un
 *     objeto { en: "...", es: "..." } — para el idioma dado.
 *     Usa inglés como alternativa y, si no hay nada, cadena vacía.
 */
export const t = (field, lang) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field?.[lang] || field?.['en'] || '';
};

/*
 * EN: Human-readable labels for common publication types.
 *     Unknown types (anything not listed here) fall back to
 *     the raw value with the first letter capitalised, so you
 *     can always use a new `type` in the JSON without touching
 *     this file — it just won't have a "pretty" translated label.
 * ES: Etiquetas legibles para los tipos de publicación más
 *     comunes. Los tipos desconocidos (cualquiera que no esté
 *     aquí) usan el valor tal cual con la primera letra en
 *     mayúscula, así que siempre puedes usar un `type` nuevo en
 *     el JSON sin tocar este fichero — simplemente no tendrá una
 *     etiqueta traducida "bonita".
 */
const TYPE_LABELS = {
    journal: { en: 'Journal', es: 'Revista' },
    conference: { en: 'Conference', es: 'Congreso' },
    workshop: { en: 'Workshop', es: 'Taller' },
    preprint: { en: 'Preprint', es: 'Preprint' },
    thesis: { en: 'Thesis', es: 'Tesis' },
    'book-chapter': { en: 'Book Chapter', es: 'Capítulo de libro' },
    other: { en: 'Other', es: 'Otro' },
};

export const typeLabel = (type, lang) => {
    if (!type) return '';
    const known = TYPE_LABELS[type];
    if (known) return known[lang] || known.en;
    // EN: Unknown type -> capitalise it as a reasonable default.
    // ES: Tipo desconocido -> lo capitalizamos como valor por defecto razonable.
    return type.charAt(0).toUpperCase() + type.slice(1);
};

/*
 * EN: Friendly labels + order for the most common link types.
 *     `links` in the JSON is intentionally free-form — ANY key
 *     is allowed (e.g. "poster", "dataset", "erratum"...). Keys
 *     listed here get a nice label and a fixed order; anything
 *     else still renders fine, just capitalised and appended
 *     at the end, alphabetically.
 * ES: Etiquetas amigables + orden para los tipos de enlace más
 *     comunes. `links` en el JSON es deliberadamente libre —
 *     se admite CUALQUIER clave (p. ej. "poster", "dataset",
 *     "erratum"...). Las claves listadas aquí obtienen una
 *     etiqueta bonita y un orden fijo; cualquier otra igualmente
 *     se muestra bien, solo que capitalizada y al final, por
 *     orden alfabético.
 */
const LINK_LABELS = {
    pdf: 'PDF',
    doi: 'DOI',
    arxiv: 'arXiv',
    code: 'Code',
    dataset: 'Dataset',
    slides: 'Slides',
    video: 'Video',
    poster: 'Poster',
    bibtex: 'BibTeX',
};
const LINK_ORDER = Object.keys(LINK_LABELS);

/*
 * EN: Turns a publication's `links` object into a row of link
 *     badges. Any key with a falsy value (null, "", undefined)
 *     is skipped — that's how you "turn off" a link in the JSON
 *     without deleting the key (see the "arxiv": null example).
 * ES: Convierte el objeto `links` de una publicación en una
 *     fila de insignias de enlace. Cualquier clave con un valor
 *     falso (null, "", undefined) se omite — así se "apaga" un
 *     enlace en el JSON sin borrar la clave (ver el ejemplo
 *     "arxiv": null).
 */
export const renderLinks = (links) => {
    if (!links || typeof links !== 'object') return '';

    const keys = Object.keys(links).filter(k => links[k]);
    if (keys.length === 0) return '';

    // EN: Known keys first (in LINK_ORDER), then unknown keys A-Z.
    // ES: Claves conocidas primero (en LINK_ORDER), luego las
    //     desconocidas por orden alfabético.
    keys.sort((a, b) => {
        const ia = LINK_ORDER.indexOf(a);
        const ib = LINK_ORDER.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
    });

    return keys.map(key => {
        const label = LINK_LABELS[key] || (key.charAt(0).toUpperCase() + key.slice(1));
        return `<a href="${links[key]}" target="_blank" rel="noopener noreferrer" class="link-badge">${label}</a>`;
    }).join('');
};

/*
 * EN: Best available date for a publication, used for sorting.
 *     Prefers the precise `date` field (YYYY-MM-DD); falls back
 *     to Jan 1st of `year` if only the year is known; falls back
 *     to the epoch (so items with no date/year at all sort last)
 *     if neither is present.
 * ES: Mejor fecha disponible para una publicación, usada para
 *     ordenar. Prefiere el campo `date` preciso (AAAA-MM-DD); si
 *     solo hay `year`, usa el 1 de enero de ese año; y si no hay
 *     ni fecha ni año, usa el "epoch" (para que esos elementos
 *     queden al final al ordenar).
 */
export const resolveDate = (pub) => {
    if (pub.date) {
        const d = new Date(pub.date);
        if (!isNaN(d)) return d;
    }
    if (pub.year) return new Date(`${pub.year}-01-01`);
    return new Date(0);
};

/*
 * EN: Sorts a COPY of the given array (doesn't mutate the input).
 *     mode: 'date-desc' (default, newest first), 'date-asc'
 *     (oldest first), or 'title-asc' (alphabetical by title).
 * ES: Ordena una COPIA del array dado (no modifica el original).
 *     mode: 'date-desc' (por defecto, más recientes primero),
 *     'date-asc' (más antiguas primero), o 'title-asc'
 *     (alfabético por título).
 */
export const sortPublications = (list, mode = 'date-desc') => {
    const copy = [...list];
    if (mode === 'title-asc') {
        copy.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (mode === 'date-asc') {
        copy.sort((a, b) => resolveDate(a) - resolveDate(b));
    } else {
        // 'date-desc'
        copy.sort((a, b) => resolveDate(b) - resolveDate(a));
    }
    return copy;
};

/*
 * EN: Renders ONE publication as a full-width row (title,
 *     authors, venue/year/type, optional abstract, tags, links).
 *     Used for both the teaser and the full list — the layout is
 *     always one publication per row (vertical list), never a
 *     multi-column grid.
 * ES: Renderiza UNA publicación como una fila de ancho completo
 *     (título, autores, revista/año/tipo, resumen opcional,
 *     etiquetas, enlaces). Se usa tanto en el avance como en la
 *     lista completa — el diseño siempre es una publicación por
 *     fila (lista vertical), nunca una rejilla multi-columna.
 */
export const renderPublicationRow = (pub, lang) => {
    const authors = Array.isArray(pub.authors) ? pub.authors.join(', ') : (pub.authors || '');
    const venueYear = [pub.venue, pub.year].filter(Boolean).join(' · ');
    const abstract = t(pub.abstract, lang);
    const tags = Array.isArray(pub.tags) && pub.tags.length
        ? `<div class="tags">${pub.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
        : '';
    const links = renderLinks(pub.links);

    return `
        <article class="publication-row">
            ${pub.type ? `<span class="event-type publication-type">${typeLabel(pub.type, lang)}</span>` : ''}
            <h3 class="publication-title">${pub.title || ''}</h3>
            ${authors ? `<p class="publication-authors">${authors}</p>` : ''}
            ${venueYear ? `<p class="publication-venue">${venueYear}</p>` : ''}
            ${abstract ? `<p class="publication-abstract">${abstract}</p>` : ''}
            ${tags}
            ${links ? `<div class="event-links publication-links">${links}</div>` : ''}
        </article>
    `;
};

/* ============================================================
 * EN: Publications are stored PER YEAR now:
 *         data/publications-years.json   <- ["2026", "2025", ...]
 *         data/2026/publications.json
 *         data/2025/publications.json
 *         ...
 *     `data/publications-years.json` is the only place that
 *     lists which years exist — it's what makes the year
 *     "variable": add a new folder + file, add its year to this
 *     index, and it's picked up automatically. Nothing in the
 *     .js files needs to change.
 *
 * ES: Las publicaciones ahora se guardan POR AÑO:
 *         data/publications-years.json   <- ["2026", "2025", ...]
 *         data/2026/publications.json
 *         data/2025/publications.json
 *         ...
 *     `data/publications-years.json` es el único sitio que lista
 *     qué años existen — es lo que hace que el año sea
 *     "variable": añade una carpeta + fichero nuevos, añade su
 *     año a este índice, y se recoge automáticamente. No hace
 *     falta cambiar nada en los ficheros .js.
 * ============================================================ */

// EN: Memoised promise so repeated calls (e.g. on every language
//     change) don't re-fetch everything from the network.
// ES: Promesa memorizada para que llamadas repetidas (p. ej. en
//     cada cambio de idioma) no vuelvan a descargar todo de la red.
let _cachedFetch = null;

/*
 * EN: Fetches data/publications-years.json, then every
 *     data/<year>/publications.json it lists, and returns the
 *     combined, flat array of all publications.
 *     - If a given year's file is missing or invalid, it's
 *       skipped (logged to the console) instead of breaking the
 *       whole page.
 *     - If a publication doesn't set its own `year` field, the
 *       folder's year is used automatically.
 *     Pass `{ forceRefresh: true }` to bypass the cache (not
 *     needed in normal use).
 *
 * ES: Descarga data/publications-years.json, luego cada
 *     data/<year>/publications.json que liste, y devuelve el
 *     array combinado y plano con todas las publicaciones.
 *     - Si el fichero de un año falta o no es válido, se omite
 *       (se registra en la consola) en lugar de romper toda la
 *       página.
 *     - Si una publicación no tiene su propio campo `year`, se
 *       usa automáticamente el año de la carpeta.
 *     Pasa `{ forceRefresh: true }` para saltarte la caché (no
 *     hace falta en uso normal).
 */
export function fetchAllPublications({ forceRefresh = false } = {}) {
    if (_cachedFetch && !forceRefresh) return _cachedFetch;

    _cachedFetch = (async () => {
        const yearsRes = await fetch('data/publications-years.json');
        if (!yearsRes.ok) {
            throw new Error(`HTTP ${yearsRes.status} fetching data/publications-years.json`);
        }
        const years = await yearsRes.json();
        if (!Array.isArray(years)) {
            throw new Error('data/publications-years.json must be a JSON array of years');
        }

        const perYear = await Promise.all(years.map(async (year) => {
            try {
                const res = await fetch(`data/${year}/publications.json`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const list = await res.json();
                if (!Array.isArray(list)) throw new Error('expected a JSON array');
                // EN: Fill in `year` from the folder when a publication omits it.
                // ES: Rellena `year` con el de la carpeta cuando una publicación lo omite.
                return list.map(pub => ({ ...pub, year: pub.year ?? Number(year) }));
            } catch (err) {
                console.error(`Failed to load data/${year}/publications.json`, err);
                return [];
            }
        }));

        return perYear.flat();
    })();

    return _cachedFetch;
}