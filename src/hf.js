// --- MonRdvFacile - src/hf.js (WOW Factor Update) ---
// --- Dynamically loads header and footer HTML, their styles, and handles basic header JS ---

(function() { // IIFE to avoid polluting global scope, though DOMContentLoaded ensures script runs after DOM is ready

    // --- CSS Styles for Header and Footer ---
    const hfStyles = `
        :root { /* Define common variables if not already defined by the page, or use hardcoded values */
            --hf-primary-color: #007bff; /* Default if page doesn't set --primary-color */
            --hf-primary-darker: #0056b3;
            --hf-white-color: #ffffff;
            --hf-text-color: #343a40;
            --hf-text-light-color: #6c757d;
            --hf-header-bg: #ffffff;
            --hf-header-shadow: 0 3px 10px rgba(0,0,0,0.05);
            --hf-footer-bg: #2c3e50;
            --hf-footer-text-color: #bdc3c7;
            --hf-footer-link-hover: #007bff; /* Use primary for hover in dark footer */
            --hf-border-radius-md: 8px;
        }

        /* Header Styles */
        #app-header {
            background-color: var(--hf-header-bg);
            color: var(--hf-text-color);
            box-shadow: var(--hf-header-shadow);
            position: sticky;
            top: 0;
            z-index: 1000;
            padding: 0; /* Remove default padding if any */
        }
        #app-header .header-container { /* Use class from injected HTML */
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 0; /* Adjusted padding */
            max-width: 1320px; /* Match index.html container */
            margin: 0 auto;
            width: 90%;
        }
        #app-header .logo a {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--hf-primary-color, #007bff); /* Use CSS var from page or fallback */
            text-decoration: none;
            letter-spacing: -0.5px;
        }
        #app-header .main-nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
        }
        #app-header .main-nav li {
            margin-left: 20px; /* Adjust as needed */
        }
        #app-header .main-nav a {
            color: var(--hf-text-color, #343a40);
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            padding: 10px 15px;
            border-radius: var(--hf-border-radius-md, 8px);
            transition: background-color 0.25s ease, color 0.25s ease;
            display: flex; /* For icon alignment */
            align-items: center;
        }
        #app-header .main-nav a i {
            margin-right: 8px;
            font-size: 1.1em; /* Slightly larger icons */
            width: 20px; /* Ensure consistent icon spacing */
            text-align: center;
        }
        #app-header .main-nav a:hover,
        #app-header .main-nav a.active-nav-link { /* Add class for active link indication */
            background-color: var(--hf-primary-color, #007bff);
            color: var(--hf-white-color, #ffffff);
        }

        /* Mobile Navigation Styles */
        #app-header .mobile-nav-toggle {
            display: none; /* Hidden by default, shown by media query */
            border: none;
            background: none;
            cursor: pointer;
            padding: 10px;
        }
        #app-header .mobile-nav-toggle button {
            background: transparent;
            border: none;
            color: var(--hf-text-color, #343a40);
            font-size: 1.8rem; /* Larger hamburger */
            padding: 0;
            line-height: 1;
        }

        /* Footer Styles */
        #app-footer {
            background-color: var(--hf-footer-bg, #2c3e50);
            color: var(--hf-footer-text-color, #bdc3c7);
            padding: 3rem 0;
            text-align: center;
            font-size: 0.9rem;
            margin-top: auto; /* Pushes footer to bottom if content is short */
        }
        #app-footer .footer-container { /* Use class from injected HTML */
            max-width: 1320px;
            margin: 0 auto;
            width: 90%;
        }
        #app-footer p {
            margin-bottom: 0.5rem;
            color: var(--hf-footer-text-color, #bdc3c7); /* Ensure p tags inherit footer text color */
        }
        #app-footer a {
            color: var(--hf-footer-text-color, #bdc3c7); /* Subtler link color in footer */
            text-decoration: none;
            transition: color 0.2s ease;
        }
        #app-footer a:hover {
            color: var(--hf-footer-link-hover, #007bff); /* Brighter hover for links */
            text-decoration: underline;
        }
        #app-footer .footer-social-links {
            margin-top: 1rem;
            margin-bottom: 1rem;
        }
        #app-footer .footer-social-links a {
            color: var(--hf-footer-text-color, #bdc3c7);
            font-size: 1.5rem;
            margin: 0 10px;
        }
        #app-footer .footer-social-links a:hover {
            color: var(--hf-white-color, #ffffff);
            text-decoration: none; /* No underline for social icons */
        }


        /* Responsive for Header/Footer (align with index.html's media queries) */
        @media (max-width: 768px) {
            #app-header .main-nav {
                display: none; /* Hidden by default on mobile */
                flex-direction: column;
                position: absolute;
                top: 100%; /* Position below header */
                left: 0;
                width: 100%;
                background-color: var(--hf-header-bg, #ffffff);
                box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                padding: 10px 0;
                border-top: 1px solid #eee;
            }
            #app-header .main-nav.active { /* Class added by JS */
                display: flex;
            }
            #app-header .main-nav ul {
                flex-direction: column;
                width: 100%;
            }
            #app-header .main-nav li {
                margin: 0;
                width: 100%;
                text-align: center;
            }
            #app-header .main-nav a {
                display: block;
                padding: 15px 20px; /* Larger tap targets */
                border-bottom: 1px solid #f0f0f0;
                border-radius: 0; /* Full width links */
            }
            #app-header .main-nav li:last-child a {
                border-bottom: none;
            }
            #app-header .mobile-nav-toggle {
                display: block; /* Show hamburger */
            }
        }
    `;

    // Function to inject styles into the head
    function addStylesToHead() {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = hfStyles;
        document.head.appendChild(styleSheet);
    }

    // Call this function as soon as hf.js runs
    addStylesToHead();


    // --- Header HTML Content (with aria attributes and refined structure) ---
    // Language attributes (data-fr, data-en) will be handled by each page's specific language update logic
    // after this HTML is injected.
    const headerHTML = `
        <div class="header-container"> {/* Changed from class="container header-container" to avoid conflict if page has own .container */}
            <div class="logo">
                <a href="index.html" title="Accueil MonRdvFacile">MonRdvFacile</a>
            </div>
            <nav class="main-nav" aria-label="Main navigation">
                <ul>
                    <li><a href="index.html" class="nav-link-home"><i class="fas fa-home" aria-hidden="true"></i> <span data-fr="Accueil" data-en="Home">Accueil</span></a></li>
                    <li><a href="create-event.html" class="nav-link-create"><i class="fas fa-plus-circle" aria-hidden="true"></i> <span data-fr="Créer" data-en="Create">Créer</span></a></li>
                    <li><a href="edit-event.html" class="nav-link-edit"><i class="fas fa-edit" aria-hidden="true"></i> <span data-fr="Modifier" data-en="Edit">Modifier</span></a></li>
                </ul>
            </nav>
            <div class="mobile-nav-toggle">
                <button id="mobile-menu-button" aria-label="Toggle menu" aria-expanded="false" aria-controls="main-navigation-mobile">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    `;
    // Note: The mobile version of the nav will use the same .main-nav element and toggle its display.
    // The aria-controls on the button should ideally point to the ID of the nav ul if it had one.

    // --- Footer HTML Content ---
    const currentYear = new Date().getFullYear();
    const footerHTML = `
        <div class="footer-container"> {/* Changed from class="container footer-container" */}
            <div class="footer-social-links" aria-label="Social Media Links">
                 <a href="#" aria-label="Facebook MonRdvFacile" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Twitter MonRdvFacile" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Instagram MonRdvFacile" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
            </div>
            <p>
                <span data-fr="© ${currentYear} MonRdvFacile. Tous droits réservés." data-en="© ${currentYear} MyEasyMeeting. All rights reserved.">
                    © ${currentYear} MonRdvFacile. Tous droits réservés.
                </span>
            </p>
            <p>
                <a href="privacy.html" data-fr="Politique de confidentialité" data-en="Privacy Policy">Politique de confidentialité</a> | 
                <a href="terms.html" data-fr="Conditions d'utilisation" data-en="Terms of Service">Conditions d'utilisation</a>
            </p>
            <p data-fr="Site web pour Royan et la Charente-Maritime (17)." data-en="Website for Royan and Charente-Maritime (17).">
                Site web pour Royan et la Charente-Maritime (17).
            </p>
        </div>
    `;

    // Inject HTML into placeholders
    // This runs on DOMContentLoaded, so placeholders should exist
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

    // --- Mobile Menu Toggle Functionality (enhanced) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.querySelector('#app-header .main-nav'); // Query within header

    if (mobileMenuButton && mainNav) {
        mainNav.id = "main-navigation-mobile"; // Add ID for aria-controls
        mobileMenuButton.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            mobileMenuButton.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            const icon = mobileMenuButton.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Active Nav Link Highlighting (simple version based on URL)
    // This should run after the header HTML is injected.
    function highlightActiveNavLink() {
        const currentPath = window.location.pathname.split("/").pop(); // Gets the current HTML file name
        if (!mainNav) return;
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.classList.remove('active-nav-link');
            const linkPath = link.getAttribute('href').split("/").pop();
            // Handle index.html being "/" or "index.html"
            if (currentPath === linkPath || (currentPath === '' && linkPath === 'index.html')) {
                link.classList.add('active-nav-link');
            }
        });
    }
    highlightActiveNavLink();


    // Attempt to trigger language update on the page
    // The page's specific JS needs to have initialized its language system
    // and exposed a function (e.g., window.updatePageLanguage)
    // This relies on the page's script running before or its language function being available.
    function tryUpdatePageLanguage() {
        let langToSet = 'fr'; // Default
        try {
            langToSet = localStorage.getItem('preferredLang') || document.documentElement.lang || 'fr';
        } catch (e) { /* localStorage not available */ }

        // This is a common pattern you seem to use on pages.
        // Each page script should register a function like this.
        if (typeof window.triggerPageLanguageUpdate === "function") {
            window.triggerPageLanguageUpdate(langToSet);
        } else if (typeof window.inlineIndexChangeLang === "function" && window.location.pathname.endsWith('index.html')) {
             window.inlineIndexChangeLang(langToSet); // For index page
        } else if (typeof window.inlineChangeLang === "function") { // For create/edit pages (assuming this naming)
             window.inlineChangeLang(langToSet);
        } else if (typeof window.switchLanguageDisplay === "function") { // For event-display page
             window.switchLanguageDisplay(langToSet);
        }
        else {
            // Fallback: if no global page function, hf.js can attempt to translate its OWN content.
            // This is less ideal as it doesn't coordinate with the page's main content translation.
            // console.warn("No global page language update function found. Header/footer might not be translated initially by page logic.");
            // For now, we rely on the page's own DOMContentLoaded to query and translate.
        }
    }

    // Give the main page a moment to potentially set up its language functions
    // then try to update. This is a bit of a timing game.
    // A more robust solution would be event-driven or explicit function calls from page to hf.js.
    setTimeout(tryUpdatePageLanguage, 50); // Small delay

    console.log("hf.js (WOW Edition) loaded and executed.");

})(); // End of IIFE
