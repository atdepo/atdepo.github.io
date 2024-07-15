// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true
});

// Scroll-based background animation
const bgPattern = document.querySelector('.bg-pattern-1');
let lastScrollY = window.scrollY;

function updateBackgroundPosition() {
    const currentScrollY = window.scrollY;
    const scrollDiff = currentScrollY - lastScrollY;
    const currentPosition = getComputedStyle(bgPattern).backgroundPosition.split(' ').map(parseFloat);

    const newX = (currentPosition[0] + scrollDiff * 0.1) % 100;
    const newY = (currentPosition[1] + scrollDiff * 0.1) % 100;

    bgPattern.style.backgroundPosition = `${newX}% ${newY}%`;
    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateBackgroundPosition);
});

// Scroll indicator functionality
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    const nextSection = document.querySelector('#home + section');
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
});

// Function to fetch publication data and generate cards
async function loadPublications() {
    try {
        const response = await fetch('publications.json');
        const data = await response.json();
        const publicationsContainer = document.getElementById('publications-container');

        for (const pub of data.publications) {
            const card = await createPublicationCard(pub);
            publicationsContainer.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

function highlightAuthor(authors, highlightName) {
    return authors.map(author =>
        author.includes(highlightName)
            ? `<span class="font-semibold text-primary">${author}</span>`
            : author
    ).join(', ');
}

// Function to create a publication card
async function createPublicationCard(publication) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg overflow-hidden flex flex-col min-w-[350px] max-w-[350px]';

    const preview = await renderPDFPreview(publication.pdfFile);

    card.innerHTML = `
        <div class="relative flex-grow" style="height: 300px;">
            ${preview}
            <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                <a href="/papers/${publication.pdfFile}" download class="bg-white text-primary font-semibold py-2 px-4 rounded hover:bg-primary hover:text-white transition-colors duration-300">
                    Download PDF
                </a>
            </div>
        </div>
        <div class="p-4 flex flex-col justify-between flex-grow">
            <div>
                <h3 class="text-lg font-semibold mb-2">${publication.title}</h3>
                <p class="text-sm text-gray-600 mb-2">${highlightAuthor(publication.authors, 'Your Name')}</p>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">${publication.year}</span>
                <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">${publication.venue}</span>
                <span class="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">${publication.type}</span>
            </div>
        </div>
    `;

    return card;
}


// Function to render PDF previewf
async function renderPDFPreview(pdfFile) {
    try {
        const loadingTask = pdfjsLib.getDocument(`/papers/${pdfFile}`);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const scale = 2; // Increased scale for better resolution
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
            renderInteractiveForms: false,
            background: 'rgba(255,255,255,1)', // Ensure white background
            enableWebGL: true // Enable WebGL for better performance if available
        };

        await page.render(renderContext).promise;

        return `<img src="${canvas.toDataURL('image/jpeg', 0.8)}" alt="PDF Preview" class="w-full h-full object-contain">`;
    } catch (error) {
        console.error('Error rendering PDF preview:', error);
        return '<div class="w-full h-full flex items-center justify-center bg-gray-200">Preview unavailable</div>';
    }
}
// Function to fetch JSON data
async function fetchData() {
    try {
        const response = await fetch('data.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to render publications
async function renderPublications(publications) {
    const publicationsContainer = document.getElementById('publications-container');
    for (const pub of publications) {
        const card = await createPublicationCard(pub);
        publicationsContainer.appendChild(card);
    }
}

// Function to render conferences
function renderConferences(conferences) {
    const conferencesContainer = document.getElementById('conferences-container');
    conferencesContainer.innerHTML = conferences.map((conf, index) => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col min-w-[300px] max-w-[300px]" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="relative h-48">
                <img src="${conf.venueImage}" alt="${conf.name} Venue" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 class="text-white text-xl font-semibold text-center px-4">${conf.name}</h3>
                </div>
            </div>
            <div class="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <p class="text-gray-600 mb-2">${conf.location}</p>
                    <p class="text-gray-500">${conf.date}</p>
                </div>
                ${conf.presentation ? `
                <div class="mt-4">
                    <p class="text-sm font-semibold">Presentation:</p>
                    <p class="text-sm text-gray-600">${conf.presentation}</p>
                </div>
                ` : ''}
                ${conf.link ? `
                <div class="mt-4">
                    <a href="${conf.link}" target="_blank" rel="noopener noreferrer" class="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition duration-300">
                        More Info
                    </a>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function renderExperience(experiences) {
    const timelineContent = document.getElementById('timeline-content');
    timelineContent.innerHTML = experiences.map((exp, index) => `
        <div class="mb-8 flex justify-between ${index % 2 === 0 ? 'flex-row-reverse' : 'items-center'} w-full left-timeline">
            <div class="order-1 w-5/12"></div>
            <div class="z-20 flex items-center order-1 bg-primary shadow-xl w-8 h-8 rounded-full">
                <h1 class="mx-auto font-semibold text-lg text-white">${index + 1}</h1>
            </div>
            <div class="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4" data-aos="${index % 2 === 0 ? 'fade-left' : 'fade-right'}">
                <h3 class="mb-3 font-bold text-gray-800 text-xl">${exp.title}</h3>
                <h4 class="mb-3 font-semibold text-primary text-md">${exp.company}</h4>
                <p class="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100">${exp.description}</p>
                <p class="mt-3 text-sm text-gray-600">${exp.startDate} - ${exp.endDate}</p>
            </div>
        </div>
    `).join('');
}

// Main function to load and render all content
async function initializeContent() {
    const data = await fetchData();
    if (data) {
        renderHome(data.home);
        renderFullBio(data.home);
        renderConferences(data.conferences);
        renderExperience(data.experience);

    }
    await loadPublications();
}

// Function to render home section
function renderHome(data) {
    document.getElementById('researcher-name').textContent = data.name;
    document.getElementById('researcher-title').textContent = data.title;
    document.getElementById('short-bio').textContent = data.shortBio;
    document.getElementById('profile-photo').src = data.photoUrl;
}

// Function to render full bio
function renderFullBio(data) {
    const aboutContent = document.getElementById('about-content');
    aboutContent.innerHTML = data.fullBio.map(paragraph => `<p>${paragraph}</p>`).join('');
}

// Call the main function when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeContent);
