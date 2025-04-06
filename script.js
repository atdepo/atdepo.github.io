// Publications Module

function createPublicationControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'publications-controls';

    const filterContainer = document.createElement('div');
    filterContainer.className = 'publications-filter';

    // Create fixed filter buttons
    const buttons = [
        { text: 'All', filter: 'all' },
        { text: 'Journals', filter: 'journal' },
        { text: 'Conferences', filter: 'conference' }
    ];

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'publications-filter-btn';
        button.classList.toggle('active', btn.filter === 'all');
        button.dataset.filter = btn.filter;
        button.textContent = btn.text;
        filterContainer.appendChild(button);
    });

    controlsContainer.appendChild(filterContainer);
    return controlsContainer;
}

function createPublicationItem(pub) {
    const publicationItem = document.createElement('div');
    publicationItem.className = 'publication-item';

    // Use explicit type from JSON
    const publicationType = pub.type || 'unknown';
    publicationItem.dataset.type = publicationType;

    publicationItem.innerHTML = `
        <div class="publication-content">
            <div class="publication-header">
                <div class="publication-title">${pub.title}</div>
                <div class="publication-authors">${pub.authors}</div>
            </div>
            <div class="publication-details">
                <div class="publication-journal-container">
                    <div class="publication-journal">${pub.journal}</div>
                    <div class="publication-type-tag ${publicationType}">${publicationType}</div>
                </div>
                <div class="publication-links">
                    <a href="assets/papers/${pub.pdfFile}" target="_blank" class="publication-link paper-link">
                        View Paper <i class="fas fa-external-link-alt"></i>
                    </a>
                    <a href="assets/papers/${pub.pdfFile}" download="${pub.title}" class="publication-link pdf-link">
                        Download PDF <i class="fas fa-file-pdf"></i>
                    </a>
                </div>
            </div>
        </div>
    `;

    return publicationItem;
}
function setupPublicationFilters(publicationList) {
    const filterButtons = document.querySelectorAll('.publications-filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Get the filter type
            const filterType = button.dataset.filter;

            // Filter publications
            filterPublications(publicationList, filterType);
        });
    });
}

function filterPublications(publicationList, filterType) {
    const publicationItems = publicationList.querySelectorAll('.publication-item');

    publicationItems.forEach(item => {
        // If 'all' is selected, show all items
        if (filterType === 'all') {
            item.classList.remove('hidden');
            return;
        }

        // Check if item type matches filter type
        const isVisible = item.dataset.type === filterType;

        // Toggle visibility
        item.classList.toggle('hidden', !isVisible);
    });
}

function loadPublicationsSection(publicationsData) {
    const publicationsContainer = document.querySelector('.publications .container');

    // Check if section title exists, if not create it
    let sectionTitle = publicationsContainer.querySelector('.section-title');
    if (!sectionTitle) {
        sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = 'Publications';
        publicationsContainer.appendChild(sectionTitle);
    }

    // Clear existing content but keep the title
    const currentContent = Array.from(publicationsContainer.childNodes);
    currentContent.forEach(node => {
        if (node !== sectionTitle) {
            publicationsContainer.removeChild(node);
        }
    });

    // Create and add controls
    const controlsContainer = createPublicationControls();
    publicationsContainer.appendChild(controlsContainer);

    // Create publication list
    const publicationList = document.createElement('div');
    publicationList.className = 'publication-list';

    // Create and add publication items
    publicationsData.forEach(pub => {
        const publicationItem = createPublicationItem(pub);
        publicationList.appendChild(publicationItem);
    });

    // Add publication list to container
    publicationsContainer.appendChild(publicationList);

    // Setup filters
    setupPublicationFilters(publicationList);
}

// Update CV Section Rendering
function renderCVSection(cvData, sectionElement, isSectionEducation = true) {
    // Check if the section exists
    if (!sectionElement) {
        console.error('CV section element not found');
        return;
    }

    // Clear existing items except the title
    let title = sectionElement.querySelector('h3');
    if (!title) {
        title = document.createElement('h3');
        title.textContent = isSectionEducation ? 'Education' : 'Research Experience';
        sectionElement.appendChild(title);
    }

    const currentContent = Array.from(sectionElement.childNodes);
    currentContent.forEach(node => {
        if (node !== title) {
            sectionElement.removeChild(node);
        }
    });

    // Add new items - without type tags
    cvData.forEach(item => {
        const cvItem = document.createElement('div');
        cvItem.className = 'cv-item';

        cvItem.innerHTML = `
            <div class="cv-item-title">${item.title}</div>
            <div class="cv-item-subtitle">${item.institution || ''}</div>
            <div class="cv-item-date">${item.period || ''}</div>
            <p>${item.description || ''}</p>
        `;

        sectionElement.appendChild(cvItem);
    });
}
// Dynamic Content Loader
document.addEventListener('DOMContentLoaded', () => {
    // Create overlay for mobile menu
    const body = document.body;
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    body.appendChild(overlay);

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on overlay
    overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    });

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animation for mobile menu items
    document.querySelectorAll('.nav-links li').forEach((item, index) => {
        item.style.setProperty('--i', index);
    });

    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Fetch the dynamic content JSON
    fetch('dynamic-content.json')
        .then(response => response.json())
        .then(data => {
            // Load Profile Section
            const headerLogo = document.querySelector('.logo');
            const heroName = document.querySelector('.hero-name');
            const heroTitle = document.querySelector('.hero-title');
            const heroSpecialty = document.querySelector('.hero-specialty');
            const socialIcons = document.querySelectorAll('.social-icons a');
            const socialKeys = ['github', 'linkedin', 'googleScholar'];

            if (headerLogo) headerLogo.textContent = data.profile.name;
            if (heroName) heroName.textContent = data.profile.name;
            if (heroTitle) heroTitle.textContent = data.profile.title;
            if (heroSpecialty) heroSpecialty.textContent = data.profile.specialty;

            socialIcons.forEach((icon, index) => {
                if (socialKeys[index]) {
                    icon.href = data.profile.socialLinks[socialKeys[index]];
                }
            });

            // Load Bio Section
            const aboutBio = document.querySelector('.about-bio');
            if (aboutBio) {
                aboutBio.innerHTML = '';
                data.about.paragraphs.forEach(paragraph => {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    aboutBio.appendChild(p);
                });
            }

            // Load Research Section
            const researchGrid = document.querySelector('.research-grid');
            if (researchGrid) {
                researchGrid.innerHTML = '';
                data.research.forEach(research => {
                    const researchItem = document.createElement('div');
                    researchItem.className = 'research-item';

                    researchItem.innerHTML = `
                        <div class="research-icon">
                            <i class="fas fa-${research.icon}"></i>
                        </div>
                        <div class="research-content">
                            <h3>${research.title}</h3>
                            <p>${research.description}</p>
                        </div>
                    `;

                    researchGrid.appendChild(researchItem);
                });
            }

            // Load Publications Section
            loadPublicationsSection(data.publications);

            // Load CV Section
            const educationSection = document.querySelector('.education');
            const researchExpSection = document.querySelector('.research-experience');

            // Render Education Section
            renderCVSection(data.cv.education, educationSection, true);

            // Render Research Experience Section
            renderCVSection(data.cv.research_experience, researchExpSection, false);

            // Update Footer
            const footer = document.querySelector('.footer .container p');
            if (footer) {
                footer.textContent = `© ${new Date().getFullYear()} ${data.profile.name}. All Rights Reserved.`;
            }
        })
        .catch(error => console.error('Error loading dynamic content:', error));
});