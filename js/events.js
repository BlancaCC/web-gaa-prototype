// ============================================================
// events.js
//
// Renders event data (from data/events.json) into ONE events
// section, split across two independent containers:
//   #upcoming-events-container -> future events
//   #past-events-container     -> past events
//
// Each container is rendered independently, so a page that only
// has one of the two ids still works fine.
// ============================================================

import { getCurrentLang } from './i18n.js';

// ---------- i18n helpers ----------

// Reads a bilingual field ({ en, es }) or a plain string.
const t = (field, lang) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.en || '';
};

const UI_TEXT = {
    location: { en: 'Location', es: 'Lugar' },
    join: { en: 'Join meeting', es: 'Unirse a la reunión' },
    upcomingTitle: { en: 'Upcoming Events', es: 'Próximos eventos' },
    pastTitle: { en: 'Previous Events', es: 'Eventos anteriores' },
    noUpcoming: { en: 'No upcoming events at the moment.', es: 'No hay próximos eventos por el momento.' },
    noPast: { en: 'No previous events yet.', es: 'Todavía no hay eventos anteriores.' },
    loadError: { en: 'Could not load events.', es: 'No se pudieron cargar los eventos.' }
};

// ---------- Date helpers ----------

const getEventDate = (event) => new Date(`${event.date}T${event.time || '00:00'}`);

const formatDate = (event, lang) => {
    const date = getEventDate(event);
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

// ---------- Links ----------
// Add a new entry here whenever a new type of link/document is
// needed (e.g. "abstract", "poster", "dataset"...). No other
// code needs to change.
const LINK_LABELS = {
    meeting: { en: 'Join meeting', es: 'Unirse a la reunión' },
    slides: { en: 'Slides', es: 'Diapositivas' },
    recording: { en: 'Recording', es: 'Grabación' },
    documentation: { en: 'Documentation', es: 'Documentación' },
    additionalMaterials: { en: 'Materials', es: 'Materiales' }
};

const renderLinks = (event, lang) => {
    if (!event.links) return '';

    const items = Object.entries(event.links)
        .filter(([, url]) => !!url)
        .map(([key, url]) => {
            const label = t(LINK_LABELS[key], lang) || key;
            return `
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="event-link">
                    ${label}
                </a>
            `;
        });

    return items.length ? `<div class="event-links">${items.join('')}</div>` : '';
};

// ---------- Card rendering ----------

const renderEventCard = (event, lang, { featured = false } = {}) => `
    <article class="event-card ${featured ? 'event-card-featured' : ''}">

        ${event.image ? `
            <div class="event-image-wrapper">
                <img
                    src="${event.image}"
                    alt="${t(event.title, lang)}"
                    class="event-image"
                    loading="lazy"
                >
            </div>
        ` : ''}

        <div class="event-content">

            <p class="event-date">
                ${formatDate(event, lang)}${event.time ? ` · ${event.time}` : ''}
            </p>

            <h3 class="event-title">${t(event.title, lang)}</h3>

            ${event.type ? `<span class="event-type">${event.type}</span>` : ''}

            ${event.location ? `
                <p class="event-location">
                    <strong>${t(UI_TEXT.location, lang)}:</strong> ${t(event.location, lang)}
                </p>
            ` : ''}

            ${event.online ? `
                <p class="event-online">
                    <strong>${event.online.platform}:</strong>
                    <a href="${event.online.url}" target="_blank" rel="noopener noreferrer">
                        ${t(UI_TEXT.join, lang)}
                    </a>
                </p>
            ` : ''}

            ${event.speaker ? `
                <div class="event-speaker">
                    <strong>${event.speaker.name}</strong>
                    ${event.speaker.affiliation ? `
                        <span>${t(event.speaker.affiliation, lang)}</span>
                    ` : ''}
                </div>
            ` : ''}

            ${event.description ? `
                <p class="event-description">${t(event.description, lang)}</p>
            ` : ''}

            ${event.tags?.length ? `
                <div class="tags">
                    ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}

            ${renderLinks(event, lang)}

        </div>
    </article>
`;

// ---------- Event selection logic ----------

const splitEvents = (events) => {
    const now = new Date();

    const upcoming = events
        .filter(event => getEventDate(event) >= now)
        .sort((a, b) => getEventDate(a) - getEventDate(b));

    const past = events
        .filter(event => getEventDate(event) < now)
        .sort((a, b) => getEventDate(b) - getEventDate(a));

    return { upcoming, past };
};

// ---------- Group renderer ----------
// Renders a titled group of events into a container, or an
// empty-state message if there are none. Used for both the
// upcoming and the past containers.
const renderGroup = (container, events, lang, { title, emptyText }) => {
    if (!container) return;

    if (!events.length) {
        container.innerHTML = `
            <h2>${title}</h2>
            <p class="no-events">${emptyText}</p>
        `;
        return;
    }

    container.innerHTML = `
        <h2>${title}</h2>
        <div class="events-scroller">
            ${events.map((event, index) => renderEventCard(event, lang, { featured: index === 0 })).join('')}
        </div>
    `;
};

// ---------- Entry point ----------

const CONTAINER_IDS = ['upcoming-events-container', 'past-events-container'];

export async function renderEvents() {
    const upcomingContainer = document.getElementById('upcoming-events-container');
    const pastContainer = document.getElementById('past-events-container');

    // Nothing to render on this page.
    if (!upcomingContainer && !pastContainer) return;

    const lang = getCurrentLang();

    try {
        const response = await fetch('data/events.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const events = await response.json();
        const { upcoming, past } = splitEvents(events);

        if (upcomingContainer) {
            renderGroup(upcomingContainer, upcoming, lang, {
                title: t(UI_TEXT.upcomingTitle, lang),
                emptyText: t(UI_TEXT.noUpcoming, lang)
            });
            upcomingContainer.dataset.rendered = 'true';
        }

        if (pastContainer) {
            renderGroup(pastContainer, past, lang, {
                title: t(UI_TEXT.pastTitle, lang),
                emptyText: t(UI_TEXT.noPast, lang)
            });
            pastContainer.dataset.rendered = 'true';
        }

    } catch (error) {
        console.error('Failed to load events data:', error);

        const errorMessage = `<p class="error">${t(UI_TEXT.loadError, lang)}</p>`;

        if (upcomingContainer) {
            upcomingContainer.innerHTML = errorMessage;
            upcomingContainer.dataset.rendered = 'true';
        }
        if (pastContainer) {
            pastContainer.innerHTML = errorMessage;
            pastContainer.dataset.rendered = 'true';
        }
    }
}

// ---------- Stay in sync with a client-side router ----------
//
// If a router fetches this section's fragment and swaps it into
// the page after we've already rendered, our cards get wiped out
// (the fragment's containers are empty). Instead of depending on
// the router to tell us when that happens, we watch the DOM: if a
// known container shows up without our "rendered" marker, it's a
// fresh/empty one and we re-render into it.

const needsRender = () =>
    CONTAINER_IDS.some(id => {
        const el = document.getElementById(id);
        return el && el.dataset.rendered !== 'true';
    });

let renderScheduled = false;

const scheduleRender = () => {
    if (renderScheduled) return;
    renderScheduled = true;
    // Coalesce bursts of DOM mutations into a single render call.
    queueMicrotask(() => {
        renderScheduled = false;
        renderEvents();
    });
};

const observer = new MutationObserver(() => {
    if (needsRender()) scheduleRender();
});

observer.observe(document.body, { childList: true, subtree: true });

// Re-render on language switch. Language changes should always
// re-render regardless of the "already rendered" marker, so we
// clear it first.
window.addEventListener('languageChanged', () => {
    CONTAINER_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) delete el.dataset.rendered;
    });
    renderEvents();
});

// Initial render, in case app.js doesn't call renderEvents() itself.
// Safe to call multiple times (idempotent thanks to data-rendered).
document.addEventListener('DOMContentLoaded', renderEvents);