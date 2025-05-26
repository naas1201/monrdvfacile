// --- MonRdvFacile - src/hf.js (Revised) ---
// --- Dynamically loads header and footer HTML and handles basic header JS ---

document.addEventListener('DOMContentLoaded', function() {
    // --- Header HTML Content ---
    const headerHTML = `
        <div class="container header-container">
            <div class="logo">
                <a href="index.html" data-fr="MonRdvFacile" data-en="MyEasyMeeting">MonRdvFacile</a>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="index.html"><i class="fas fa-home"></i> <span data-fr="Accueil" data-en="Home">Accueil</span></a></li>
                    <li><a href="create-event.html"><i class="fas fa-plus-circle"></i> <span data-fr="Créer" data-en="Create">Créer</span></a></li>
                    <li><a href="edit-event.html"><i class="fas fa-edit"></i> <span data-fr="Modifier" data-en="Edit">Modifier</span></a></li>
                    {/* Add other common links if needed */}
                </ul>
            </nav>
            <div class="mobile-nav-toggle">
                <button id="mobile-menu-button" aria-label="Toggle menu">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    `;

    // --- Footer HTML Content ---
    const footerHTML = `
        <div class="container footer-container">
            <p>
                <span data-fr="© ${new Date().getFullYear()} MonRdvFacile. Tous droits réservés." data-en="© ${new Date().getFullYear()} MyEasyMeeting. All rights reserved.">
                    © ${new Date().getFullYear()} MonRdvFacile. Tous droits réservés.
                </span>
            </p>
            <p>
                {/* Add links like privacy policy if you have them */}
            </p>
            <p data-fr="Site web pour Royan et la Charente-Maritime (17)." data-en="Website for Royan and Charente-Maritime (17).">
                Site web pour Royan et la Charente-Maritime (17).
            </p>
        </div>
    `;

    const appHeader = document.getElementById('app-header');
    const appFooter = document.getElementById('app-footer');

    if (appHeader) {
        appHeader.innerHTML = headerHTML;
    } else {
        console.error("Header placeholder with ID 'app-header' not found.");
    }

    if (appFooter) {
        appFooter.innerHTML = footerHTML;
    } else {
        console.error("Footer placeholder with ID 'app-footer' not found.");
    }

    // Mobile Menu Toggle Functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.querySelector('#app-header .main-nav'); // Be more specific

    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileMenuButton.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Call the current page's language update function if it exists
    // Each page (index.html, create-event.html, edit-event.html)
    // should define its own language update function globally on `window`
    // e.g., window.updatePageLanguage(lang)
    if (typeof window.triggerPageLanguageUpdate === "function") {
        const lang = localStorage.getItem('preferredLang') || document.documentElement.lang || 'fr';
        window.triggerPageLanguageUpdate(lang);
    } else {
        console.warn("No global triggerPageLanguageUpdate function found for hf.js to call.");
    }
});
