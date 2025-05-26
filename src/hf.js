// --- MonRdvFacile - src/hf.js ---
// --- Dynamically loads header and footer content ---

document.addEventListener('DOMContentLoaded', function() {
    // --- Header HTML Content ---
    const headerHTML = `
        <div class="container header-container">
            <div class="logo">
                <a href="index.html" data-fr="MonRdvFacile" data-en="MyEasyMeeting">MonRdvFacile</a>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="index.html" data-fr="Accueil" data-en="Home"><i class="fas fa-home"></i> <span class="nav-text" data-fr="Accueil" data-en="Home">Accueil</span></a></li>
                    <li><a href="create-event.html" data-fr="Créer un Événement" data-en="Create Event"><i class="fas fa-plus-circle"></i> <span class="nav-text" data-fr="Créer" data-en="Create">Créer</span></a></li>
                    <li><a href="admin-login.html" data-fr="Admin Événement" data-en="Event Admin"><i class="fas fa-user-shield"></i> <span class="nav-text" data-fr="Admin" data-en="Admin">Admin</span></a></li>
                    <li><a href="contact.html" data-fr="Contact" data-en="Contact"><i class="fas fa-envelope"></i> <span class="nav-text" data-fr="Contact" data-en="Contact">Contact</span></a></li>
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
            <p data-fr="© ${new Date().getFullYear()} MonRdvFacile. Tous droits réservés." data-en="© ${new Date().getFullYear()} MyEasyMeeting. All rights reserved.">
                © ${new Date().getFullYear()} MonRdvFacile. Tous droits réservés.
            </p>
            <p>
                <a href="privacy-policy.html" data-fr="Politique de Confidentialité" data-en="Privacy Policy">Politique de Confidentialité</a> |
                <a href="terms-of-service.html" data-fr="Conditions d'Utilisation" data-en="Terms of Service">Conditions d'Utilisation</a>
            </p>
            <p data-fr="Site web pour Royan et la Charente-Maritime (17)." data-en="Website for Royan and Charente-Maritime (17).">
                Site web pour Royan et la Charente-Maritime (17).
            </p>
        </div>
    `;

    // Get header and footer placeholder elements
    const appHeader = document.getElementById('app-header');
    const appFooter = document.getElementById('app-footer');

    // Inject HTML content
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

    // Add basic mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Optional: Change icon on toggle
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

    // Call language update for header/footer if language function exists
    if (typeof updateTextForLanguage === "function") {
        // Assuming 'currentLang' is globally available or retrieved by updateTextForLanguage
        // Or pass the currently detected language if your main.js stores it.
        // For now, let's assume updateTextForLanguage handles finding the current language.
        updateTextForLanguage();
    }
});

// --- Additional CSS for Header and Footer (can be moved to style.css) ---
// It's generally better to keep CSS in .css files, but for self-contained components
// loaded by JS, sometimes minimal styling is included or injected.
// For this project, let's add these to the main style.css for better organization.

/*
Add the following CSS to your css/style.css file for the header/footer:

#app-header {
    background-color: #005A9C;
    color: #FFFFFF;
    padding: 0; // Reset padding as container will handle it
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000; // Ensure header stays on top
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.logo a {
    font-size: 1.5rem;
    font-weight: bold;
    color: #FFFFFF;
    text-decoration: none;
}

.main-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
}

.main-nav li {
    margin-left: 20px;
}

.main-nav a {
    color: #FFFFFF;
    text-decoration: none;
    font-size: 1rem;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.main-nav a:hover, .main-nav a.active {
    background-color: #004170; // Darker blue on hover or active
}

.main-nav .nav-text {
    margin-left: 5px; // Space between icon and text
}

.mobile-nav-toggle {
    display: none; // Hidden by default, shown in media query
    border: none;
    background: none;
    color: #FFFFFF;
    font-size: 1.5rem;
    cursor: pointer;
}

#app-footer {
    background-color: #333333; /* Darker footer */
    color: #E0E0E0; /* Lighter text for footer */
    padding: 2rem 0;
    text-align: center;
    font-size: 0.9rem;
    margin-top: auto; /* Pushes footer to bottom if content is short */
}

#app-footer a {
    color: #B0C4DE; /* Light Steel Blue for links in footer */
}

#app-footer a:hover {
    color: #FFFFFF;
    text-decoration: underline;
}

// Responsive adjustments for navigation (add to style.css media queries)
@media (max-width: 768px) {
    .main-nav {
        display: none; // Hide nav by default on mobile
        flex-direction: column;
        position: absolute;
        top: 100%; // Position below the header
        left: 0;
        width: 100%;
        background-color: #005A9C; // Same as header
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 10px 0;
    }

    .main-nav.active {
        display: flex; // Show when active
    }

    .main-nav ul {
        flex-direction: column;
        width: 100%;
    }

    .main-nav li {
        margin: 0;
        text-align: center;
    }
    .main-nav li a {
        display: block;
        padding: 10px;
        border-bottom: 1px solid #004170; // Separator for mobile links
    }
    .main-nav li:last-child a {
        border-bottom: none;
    }

    .mobile-nav-toggle {
        display: block; // Show hamburger icon
    }

    .main-nav .nav-text { // Ensure nav text is always visible on mobile if icons are too small
        display: inline;
    }
}

// Hide nav text on medium screens if only icons are desired, then show on small
@media (min-width: 769px) and (max-width: 992px) {
    .main-nav .nav-text {
        // display: none; // Uncomment if you want icon-only on tablets
    }
}


*/
