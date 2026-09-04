import { getCurrentLang, applyTranslations } from './i18n.js';

const t = (field, lang) => {
    if (typeof field === 'string') return field;
    return field?.[lang] || field?.['en'] || '';
};

export async function renderPeople() {
    const container = document.getElementById('people-container');
    if (!container) return;

    try {
        const res = await fetch('data/people.json');
        const members = await res.json();
        const lang = getCurrentLang();

        const researchers = members.filter(m => m.category === 'researcher');
        const affiliated = members.filter(m => m.category === 'affiliated');
        const phdStudents = members.filter(m => m.category === 'phd');
        const alumni = members.filter(m => m.category === 'alumni');

        const renderCard = (m) => {
            return `
                <div class="card person-card">
                    <div class="person-header">
                        <h3 class="person-name">${m.name}</h3>
                        <p class="person-role">${t(m.role, lang)}</p>
                        ${m.affiliation ? `<p class="person-affil">${t(m.affiliation, lang)}</p>` : ''}
                    </div>

                    ${m.bio ? `<p class="person-bio">${t(m.bio, lang)}</p>` : ''}

                    ${m.currentWork ? `
                        <div class="alumni-badge">
                            <span class="badge-title" data-i18n="people.currentRole">Current Position:</span>
                            <span class="badge-content">${t(m.currentWork, lang)}</span>
                        </div>
                    ` : ''}

                    ${m.thesisTitle ? `
                        <div class="alumni-thesis">
                            <span class="badge-title" data-i18n="people.thesis">Thesis:</span>
                            <span class="badge-content"><em>${t(m.thesisTitle, lang)}</em> (${m.defenseYear})</span>
                        </div>
                    ` : ''}

                    ${m.interests && m.interests.length ? `
                        <div class="tags">
                            ${m.interests.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}

                    <div class="person-links">
                        ${m.email ? `<a href="mailto:${m.email}" title="Email" class="link-icon">✉</a>` : ''}
                        ${m.scholar ? `<a href="${m.scholar}" target="_blank" rel="noopener noreferrer" title="Google Scholar" class="link-badge">Scholar</a>` : ''}
                        ${m.orcid ? `<a href="https://orcid.org/${m.orcid}" target="_blank" rel="noopener noreferrer" title="ORCID" class="link-badge orcid">ORCID</a>` : ''}
                        ${m.website ? `<a href="${m.website}" target="_blank" rel="noopener noreferrer" title="Website" class="link-badge">Web</a>` : ''}
                    </div>
                </div>
            `;
        };

        const renderSection = (titleKey, items) => {
            if (!items.length) return '';
            return `
                <div class="people-subgroup">
                    <h2 class="subgroup-title" data-i18n="${titleKey}"></h2>
                    <div class="card-grid">
                        ${items.map(renderCard).join('')}
                    </div>
                </div>
            `;
        };

        container.innerHTML = `
            ${renderSection('people.researchers', researchers)}
            ${renderSection('people.affiliated', affiliated)}
            ${renderSection('people.phd', phdStudents)}
            ${renderSection('people.alumni', alumni)}
        `;

        applyTranslations();
    } catch (err) {
        console.error('Failed to load people data', err);
    }
}

window.addEventListener('languageChanged', renderPeople);