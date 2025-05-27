// --- MonRdvFacile - src/hf.js (WOW Factor Update - Comment Removed) ---
// --- Dynamically loads header and footer HTML, their styles, and handles basic header JS ---

(function() { // IIFE to avoid polluting global scope

    // --- CSS Styles for Header and Footer ---
    const hfStyles = `
        :root {
            --hf-primary-color: #007bff;
            --hf-primary-darker: #0056b3;
            --hf-white-color: #ffffff;
            --hf-text-color: #343a40;
            --hf-text-light-color: #6c757d;
            --hf-header-bg: #ffffff;
            --hf-header-shadow: 0 3px 10px rgba(0,0,0,0.05);
            --hf-footer-bg: #2c3e50;
            --hf-footer-text-color: #bdc3c7;
            --hf-footer-link-hover: #007bff;
            --hf-border-radius-md: 8px;
        }

        #app-header {
            background-color: var(--hf-header-bg);
            color: var(--hf-text-color);
            box-shadow: var(--hf-header-shadow);
            position: sticky;
            top: 0;
            z-index: 1000;
            padding: 0;
        }
        #app-header .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 0;
            max-width: 1320px;
            margin: 0 auto;
            width: 90%;
        }
        #app-header .logo a {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--hf-primary-color, #007bff);
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
            margin-left: 20px;
        }
        #app-header .main-nav a {
            color: var(--hf-text-color, #343a40);
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            padding: 10px 15px;
            border-radius: var(--hf-border-radius-md, 8px);
            transition: background-color 0.25s ease, color 0.25s ease;
            display: flex;
            align-items: center;
        }
        #app-header .main-nav a i {
            margin-right: 8px;
            font-size: 1.1em;
            width: 20px;
            text-align: center;
        }
        #app-header .main-nav a:hover,
        #app-header .main-nav a.active-nav-link {
            background-color: var(--hf-primary-color, #007bff);
            color: var(--hf-white-color, #ffffff);
        }
        #app-header .mobile-nav-toggle {
            display: none;
            border: none;
            background: none;
            cursor: pointer;
            padding: 10px;
        }
        #app-header .mobile-nav-toggle button {
            background: transparent;
            border: none;
            color: var(--hf-text-color, #343a40);
            font-size: 1.8rem;
            padding: 0;
            line-height: 1;
        }
        #app-footer {
            background-color: var(--hf-footer-bg, #2c3e50);
            color: var(--hf-footer-text-color, #bdc3c7);
            padding: 3rem 0;
            text-align: center;
            font-size: 0.9rem;
            margin-top: auto;
        }
        #app-footer .footer-container {
            max-width: 1320px;
            margin: 0 auto;
            width: 90%;
        }
        #app-footer p {
            margin-bottom: 0.5rem;
            color: var(--hf-footer-text-color, #bdc3c7);
        }
        #app-footer a {
            color: var(--hf-footer-text-color, #bdc3c7);
            text-decoration: none;
            transition: color 0.2s ease;
        }
        #app-footer a:hover {
            color: var(--hf-footer-link-hover, #007bff);
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
            text-decoration: none;
        }
        @media (max-width: 768px) {
            #app-header .main-nav {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: var(--hf-header-bg, #ffffff);
                box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                padding: 10px 0;
                border-top: 1px solid #eee;
            }
            #app-header .main-nav.active {
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
                padding: 15px 20px;
                border-bottom: 1px solid #f0f0f0;
                border-radius: 0;
            }
            #app-header .main-nav li:last-child a {
                border-bottom: none;
            }
            #app-header .mobile-nav-toggle {
                display: block;
            }
        }
    `;

    function addStylesToHead() {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = hfStyles;
        document.head.appendChild(styleSheet);
    }

    addStylesToHead();

    const headerHTML = `
        <div class="header-container">
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

    const currentYear = new Date().getFullYear();
    const footerHTML = `
        <div class="footer-container">
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

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.querySelector('#app-header .main-nav');

    if (mobileMenuButton && mainNav) {
        mainNav.id = "main-navigation-mobile";
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

    function highlightActiveNavLink() {
        const currentPath = window.location.pathname.split("/").pop() || "index.html"; // Default to index.html if path is just "/"
        if (!mainNav) return;
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.classList.remove('active-nav-link');
            const linkPath = link.getAttribute('href').split("/").pop() || "index.html";
            if (currentPath === linkPath) {
                link.classList.add('active-nav-link');
            }
        });
    }
    
    // Call highlight after HTML is injected and DOM is likely stable for these elements
    if (appHeader) { // Ensure header was found before trying to highlight
        highlightActiveNavLink();
    }


    function tryUpdatePageLanguage() {
        let langToSet = 'fr';
        try {
            langToSet = localStorage.getItem('preferredLang') || document.documentElement.lang || 'fr';
        } catch (e) { /* localStorage not available */ }

        // Expose a flag that pages can check or use a more robust event system
        window.hfHasLoaded = true; 
        window.hfInitialLang = langToSet;

        if (typeof window.triggerPageLanguageUpdate === "function") {
            window.triggerPageLanguageUpdate(langToSet);
        } else if (typeof window.inlineIndexChangeLang === "function" && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
             window.inlineIndexChangeLang(langToSet);
        } else if (typeof window.inlineChangeLang === "function" && (window.location.pathname.includes('create-event.html') || window.location.pathname.includes('edit-event.html'))) {
             window.inlineChangeLang(langToSet);
        } else if (typeof window.switchLanguageDisplay === "function" && window.location.pathname.includes('event-display.html')) {
             window.switchLanguageDisplay(langToSet);
        }
    }

    // Run on DOMContentLoaded to ensure placeholders exist
    document.addEventListener('DOMContentLoaded', function() {
        if (appHeader && !appHeader.innerHTML.trim()) { // Check if already populated by another instance
            appHeader.innerHTML = headerHTML;
            highlightActiveNavLink(); // Highlight after injecting
        }
        if (appFooter && !appFooter.innerHTML.trim()) {
            appFooter.innerHTML = footerHTML;
        }
        
        // Mobile menu setup again in case DOMContentLoaded runs after the IIFE's main block for some reason,
        // or if elements were not found initially.
        const mobileMenuButtonRecheck = document.getElementById('mobile-menu-button');
        const mainNavRecheck = document.querySelector('#app-header .main-nav');
        if (mobileMenuButtonRecheck && mainNavRecheck && !mainNavRecheck.id) { // Check if already initialized
            mainNavRecheck.id = "main-navigation-mobile";
             mobileMenuButtonRecheck.addEventListener('click', () => {
                const isActive = mainNavRecheck.classList.toggle('active');
                mobileMenuButtonRecheck.setAttribute('aria-expanded', isActive ? 'true' : 'false');
                const icon = mobileMenuButtonRecheck.querySelector('i');
                if (isActive) { icon.classList.remove('fa-bars'); icon.classList.add('fa-times'); }
                else { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
            });
        }
        
        tryUpdatePageLanguage();
    });
    
    // Final check and language update attempt after a slight delay,
    // ensuring page-specific scripts might have had a chance to define their language functions.
    // This is a secondary measure. The primary should be the page calling back or hf.js exposing a method.
    setTimeout(() => {
        if (typeof window.triggerPageLanguageUpdate === "function") {
            // If the page has a generic trigger, call it again to be sure.
            // This assumes the page's function is idempotent or handles being called multiple times.
            let lang = 'fr';
            try { lang = localStorage.getItem('preferredLang') || document.documentElement.lang || 'fr'; } catch(e){}
            window.triggerPageLanguageUpdate(lang);
        }
    }, 100);


    console.log("hf.js (WOW Edition, Comment Removed) loaded and executed.");

})();
