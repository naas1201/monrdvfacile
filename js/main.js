// --- MonRdvFacile - js/main.js ---
// --- Handles language switching and other global scripts ---

// Variable to store the current language, defaults to 'fr'
let currentLang = 'fr';

// Function to update text content based on selected language
function updateTextForLanguage(selectedLang) {
    if (!selectedLang) {
        console.warn("No language selected for updateTextForLanguage. Using currentLang:", currentLang);
        selectedLang = currentLang; // Use the globally stored current language if none is passed
    }

    // Select all elements that have language data attributes
    const elementsToTranslate = document.querySelectorAll('[data-fr], [data-en]');

    elementsToTranslate.forEach(el => {
        const text = el.getAttribute(`data-${selectedLang}`);
        if (text) {
            // Check if the element is an input or textarea to set its value, otherwise use textContent
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type === 'submit' || el.type === 'button') {
                    el.value = text; // For button text
                } else if (el.placeholder && el.getAttribute(`data-${selectedLang}-placeholder`)) {
                    // If there's a specific placeholder attribute
                    el.placeholder = el.getAttribute(`data-${selectedLang}-placeholder`);
                } else if (el.placeholder && !el.getAttribute(`data-${selectedLang}-placeholder`) && el.dataset[selectedLang]) {
                    // Fallback for placeholders if only general data-lang attribute exists (less common for placeholders)
                    // This might need specific handling if you intend to translate placeholders this way
                }
                // For other input types, we usually don't change the 'value' attribute via language toggle
                // unless it's a display value.
            } else {
                el.textContent = text;
            }
        } else {
            // Fallback or warning if translation is missing for the selected language
            // console.warn(`Translation missing for element:`, el, `for language: ${selectedLang}`);
            // Optionally, fallback to French or a default text
            const fallbackText = el.getAttribute('data-fr') || el.textContent; // Default to French or existing content
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type === 'submit' || el.type === 'button') {
                    el.value = fallbackText;
                }
            } else {
                el.textContent = fallbackText;
            }
        }
    });

    // Update active state for language toggle links
    const langLinks = document.querySelectorAll('.lang-link');
    langLinks.forEach(link => {
        link.classList.remove('active');
        if (link.id === `lang-${selectedLang}`) {
            link.classList.add('active');
        }
    });

    // Update the lang attribute of the <html> tag
    document.documentElement.lang = selectedLang;

    // Store the selected language preference (e.g., in localStorage) for persistence
    try {
        localStorage.setItem('preferredLang', selectedLang);
    } catch (e) {
        console.warn("Could not save language preference to localStorage:", e);
    }
}

// Function to change the language
// This function will be called by the onclick handlers in index.html
function changeLang(lang) {
    if (lang !== currentLang) {
        currentLang = lang;
        updateTextForLanguage(currentLang);

        // If header/footer are loaded dynamically and need re-translation:
        // This check ensures that if hf.js defines its own update function, it can be called.
        // However, the global updateTextForLanguage should handle elements in header/footer too
        // if they have the data attributes.
        if (typeof window.updateHeaderFooterLanguage === "function") {
            window.updateHeaderFooterLanguage(currentLang);
        }
    }
}

// Function to detect preferred language (e.g., from localStorage or browser settings)
function detectLanguagePreference() {
    let preferredLang = 'fr'; // Default to French

    // 1. Check localStorage
    try {
        const storedLang = localStorage.getItem('preferredLang');
        if (storedLang && (storedLang === 'fr' || storedLang === 'en')) {
            preferredLang = storedLang;
            // console.log("Language loaded from localStorage:", preferredLang);
            return preferredLang;
        }
    } catch (e) {
        console.warn("Could not access localStorage for language preference:", e);
    }

    // 2. Check browser language (navigator.language) - very basic check
    // const browserLang = navigator.language || navigator.userLanguage;
    // if (browserLang) {
    //     if (browserLang.startsWith('en')) {
    //         preferredLang = 'en';
    //     } else if (browserLang.startsWith('fr')) {
    //         preferredLang = 'fr';
    //     }
    // }
    // console.log("Browser language detected (or defaulted):", preferredLang);

    return preferredLang;
}


// --- Initialize on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    // Set initial language based on preference or default
    currentLang = detectLanguagePreference();
    updateTextForLanguage(currentLang);

    // Add event listeners to language toggle links if they are not using onclick
    // This is an alternative to inline onclick, but since index.html has onclick,
    // this part is more for a different setup.
    // const langToggleFR = document.getElementById('lang-fr');
    // const langToggleEN = document.getElementById('lang-en');
    // if (langToggleFR) {
    //     langToggleFR.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         changeLang('fr');
    //     });
    // }
    // if (langToggleEN) {
    //     langToggleEN.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         changeLang('en');
    //     });
    // }

    console.log("MonRdvFacile main.js loaded. Current language:", currentLang);
});

// Expose functions to global scope if they are called by inline event handlers
window.changeLang = changeLang;
// Expose updateTextForLanguage if hf.js needs to call it explicitly after loading content
window.updateTextForLanguage = updateTextForLanguage;
