async function loadContent() {
    const response = await fetch('content.json');
    const data = await response.json();
    return data;
}

async function loadSection(sectionName) {
    const response = await fetch(`sections/${sectionName}.html`);
    const html = await response.text();
    return html;
}

function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'col-md-6 mb-4';
    card.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${item.title || item.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${type === 'publications' ? `${item.authors}, ${item.journal}, ${item.year}` : 
                                                            type === 'conferences' ? `${item.date}, ${item.location}` :
                                                            `${item.institution || item.company}, ${item.year}`}</h6>
                <p class="card-text">${item.description}</p>
            </div>
        </div>
    `;
    return card;
}

async function populateSection(sectionName, data) {
    const sectionHtml = await loadSection(sectionName);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML += sectionHtml;

    const sectionList = document.getElementById(`${sectionName}-list`);
    if (sectionList && data[sectionName]) {
        data[sectionName].forEach(item => {
            sectionList.appendChild(createCard(item, sectionName));
        });
    }
}

async function initializeSite() {
    const content = await loadContent();
    await populateSection('home');
    await populateSection('publications', content);
    await populateSection('conferences', content);
    await populateSection('milestones', content);
}

document.addEventListener('DOMContentLoaded', initializeSite);
