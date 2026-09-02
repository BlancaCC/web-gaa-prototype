import { getCurrentLang, applyTranslations } from './i18n.js';

const t = (field, lang) => {
    if (typeof field === 'string') return field;
    return field?.[lang] || field?.['en'] || '';
};

export async function renderAbout() {
    const container = document.getElementById('about-content');
    if (!container) return;

    try {
        const res = await fetch('data/about.json');
        const data = await res.json();
        const lang = getCurrentLang();
        const milestones = data.milestones || [];
        const funding = data.funding || [];
        const collaborations = data.collaborations || [];

        container.innerHTML = `
            <div class="about-grid">
                <div class="about-main">
                    <p class="lead-text">${t(data.presentation, lang)}</p>
                    
                    <div class="mission-vision">
                        <div class="mv-box">
                            <h3 data-i18n="about.mission">Mission</h3>
                            <p>${t(data.mission, lang)}</p>
                        </div>
                        <div class="mv-box">
                            <h3 data-i18n="about.vision">Vision</h3>
                            <p>${t(data.vision, lang)}</p>
                        </div>
                    </div>

                    <h3 data-i18n="about.funding">Funding Projects</h3>
                    <div class="funding-list">
                        ${funding.map(f => `
                            <div class="funding-item card">
                                <h4>${f.project}</h4>
                                <p class="text-muted"><strong>${f.agency}</strong> | ${f.period}</p>
                                <p class="small-text">${t(f.description, lang)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <aside class="about-sidebar">
                    <h3 data-i18n="about.milestones">Milestones</h3>
                    <ul class="timeline">
                        ${milestones.map(m => `
                            <li>
                                <span class="timeline-year">${m.year}</span>
                                <span class="timeline-event">${t(m.event, lang)}</span>
                            </li>
                        `).join('')}
                    </ul>

                    <h3 data-i18n="about.collaborators">Collaborators</h3>
                    <div class="collaborators-grid">
                        ${collaborations.map(c => `
                            <a href="${c.link}" target="_blank" rel="noopener noreferrer" title="${c.name}" class="collab-logo">
                                <div class="logo-placeholder">${c.name}</div>
                            </a>
                        `).join('')}
                    </div>
                </aside>
            </div>
        `;
        applyTranslations();
    } catch(e) {
        console.error('Failed to load about data', e);
    }
}

window.addEventListener('languageChanged', renderAbout);