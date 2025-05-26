// --- MonRdvFacile - js/create-event.js ---
// --- Handles interactivity and validation for the create event form ---

document.addEventListener('DOMContentLoaded', function() {
    // --- Get Form Elements ---
    const createEventForm = document.getElementById('createEventForm');
    const eventDescriptionTextarea = document.getElementById('eventDescription');
    const charCountDisplay = document.getElementById('charCount');
    const numMenusSelect = document.getElementById('numMenus');
    const menuNameInputsContainer = document.getElementById('menuNameInputsContainer');
    const isPaidEventCheckbox = document.getElementById('isPaidEvent');
    const eventPriceGroup = document.getElementById('eventPriceGroup');
    const eventPriceInput = document.getElementById('eventPrice');
    const adminPasswordInput = document.getElementById('adminPassword');
    const confirmAdminPasswordInput = document.getElementById('confirmAdminPassword');

    // --- Helper: Bilingual Error Messages ---
    const errorMessages = {
        passwordMismatch: {
            fr: "Les mots de passe ne correspondent pas.",
            en: "Passwords do not match."
        },
        requiredField: {
            fr: "Ce champ est requis.",
            en: "This field is required."
        },
        invalidDate: {
            fr: "Date invalide.",
            en: "Invalid date."
        },
        endDateBeforeStart: {
            fr: "La date de fin ne peut pas être antérieure à la date de début.",
            en: "End date cannot be before start date."
        },
        deadlineAfterStart: {
            fr: "La date limite d'inscription ne peut pas être postérieure à la date de début de l'événement.",
            en: "Registration deadline cannot be after the event start date."
        },
        // Add more as needed
    };

    function getErrorMessage(key, lang) {
        lang = lang || document.documentElement.lang || 'fr'; // Default to 'fr' or current page lang
        return errorMessages[key] ? (errorMessages[key][lang] || errorMessages[key]['fr']) : "Erreur inconnue.";
    }

    // --- 1. Character Counter for Event Description ---
    if (eventDescriptionTextarea && charCountDisplay) {
        const maxLength = eventDescriptionTextarea.maxLength;
        eventDescriptionTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const remaining = maxLength - currentLength;
            const lang = document.documentElement.lang || 'fr';
            const text = lang === 'fr' ? `${remaining} caractères restants` : `${remaining} characters remaining`;
            charCountDisplay.textContent = text;
            if (remaining < 0) {
                charCountDisplay.style.color = 'red';
            } else {
                charCountDisplay.style.color = '#6C757D'; // Default small text color
            }
        });
        // Trigger input event to set initial count
        eventDescriptionTextarea.dispatchEvent(new Event('input'));
    }

    // --- 2. Dynamic Menu Name Inputs ---
    const menuLabels = {
        fr: ["Nom du Menu A:", "Nom du Menu B:", "Nom du Menu C:", "Nom du Menu D:", "Nom du Menu E:"],
        en: ["Menu Name A:", "Menu Name B:", "Menu Name C:", "Menu Name D:", "Menu Name E:"]
    };
    const menuPlaceholders = {
        fr: ["Ex: Formule Classique", "Ex: Option Végétarienne", "Ex: Menu Enfant"],
        en: ["Ex: Classic Combo", "Ex: Vegetarian Option", "Ex: Kids Menu"]
    };


    function generateMenuInputs(count) {
        menuNameInputsContainer.innerHTML = ''; // Clear existing inputs
        const lang = document.documentElement.lang || 'fr';
        const currentMenuLabels = menuLabels[lang] || menuLabels['fr'];
        const currentMenuPlaceholders = menuPlaceholders[lang] || menuPlaceholders['fr'];

        for (let i = 0; i < count; i++) {
            const formGroup = document.createElement('div');
            formGroup.classList.add('form-group');

            const label = document.createElement('label');
            label.setAttribute('for', `menuName${i}`);
            label.textContent = currentMenuLabels[i] || (lang === 'fr' ? `Nom du Menu ${String.fromCharCode(65 + i)}:` : `Menu Name ${String.fromCharCode(65 + i)}:`);

            const input = document.createElement('input');
            input.type = 'text';
            input.id = `menuName${i}`;
            input.name = `menuName${i}`;
            input.required = true;
            input.maxLength = 50;
            input.placeholder = currentMenuPlaceholders[i] || (lang === 'fr' ? `Détail du Menu ${String.fromCharCode(65 + i)}` : `Details for Menu ${String.fromCharCode(65 + i)}`);

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            menuNameInputsContainer.appendChild(formGroup);
        }
    }

    if (numMenusSelect && menuNameInputsContainer) {
        numMenusSelect.addEventListener('change', function() {
            generateMenuInputs(parseInt(this.value, 10));
        });
        // Initial generation
        generateMenuInputs(parseInt(numMenusSelect.value, 10));
    }

    // Re-generate menu inputs if language changes
    // This requires main.js to expose currentLang or an event system
    // A simpler way is to re-trigger generation when language changes.
    // Assuming `updateTextForLanguage` in main.js is available and sets `document.documentElement.lang`
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                if (numMenusSelect && menuNameInputsContainer) {
                     generateMenuInputs(parseInt(numMenusSelect.value, 10));
                }
                if (eventDescriptionTextarea && charCountDisplay) {
                    eventDescriptionTextarea.dispatchEvent(new Event('input')); // Update char count language
                }
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });


    // --- 3. Show/Hide Event Price Field ---
    if (isPaidEventCheckbox && eventPriceGroup) {
        isPaidEventCheckbox.addEventListener('change', function() {
            if (this.checked) {
                eventPriceGroup.style.display = 'block';
                eventPriceInput.required = true;
            } else {
                eventPriceGroup.style.display = 'none';
                eventPriceInput.required = false;
                eventPriceInput.value = ''; // Clear value if unchecked
            }
        });
        // Initial state
        if (isPaidEventCheckbox.checked) {
            eventPriceGroup.style.display = 'block';
            eventPriceInput.required = true;
        } else {
            eventPriceGroup.style.display = 'none';
            eventPriceInput.required = false;
        }
    }

    // --- 4. Password Confirmation Validation ---
    function validatePasswords() {
        const lang = document.documentElement.lang || 'fr';
        if (adminPasswordInput.value !== confirmAdminPasswordInput.value) {
            confirmAdminPasswordInput.setCustomValidity(getErrorMessage('passwordMismatch', lang));
            return false;
        } else {
            confirmAdminPasswordInput.setCustomValidity('');
            return true;
        }
    }

    if (adminPasswordInput && confirmAdminPasswordInput) {
        adminPasswordInput.addEventListener('input', validatePasswords);
        confirmAdminPasswordInput.addEventListener('input', validatePasswords);
    }

    // --- 5. Date Validation ---
    function validateDates() {
        const startDateInput = document.getElementById('eventStartDate');
        const endDateInput = document.getElementById('eventEndDate');
        const deadlineDateInput = document.getElementById('registrationDeadlineDate');
        const lang = document.documentElement.lang || 'fr';
        let isValid = true;

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        const deadlineDate = new Date(deadlineDateInput.value);

        // Clear previous custom validity
        endDateInput.setCustomValidity("");
        deadlineDateInput.setCustomValidity("");

        if (startDateInput.value && endDateInput.value && endDate < startDate) {
            endDateInput.setCustomValidity(getErrorMessage('endDateBeforeStart', lang));
            isValid = false;
        }

        if (startDateInput.value && deadlineDateInput.value && deadlineDate > startDate) {
            deadlineDateInput.setCustomValidity(getErrorMessage('deadlineAfterStart', lang));
            isValid = false;
        }
        return isValid;
    }

    ['eventStartDate', 'eventEndDate', 'registrationDeadlineDate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', validateDates);
    });


    // --- 6. Form Submission ---
    if (createEventForm) {
        createEventForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual submission for now

            // Perform all validations
            const passwordsValid = validatePasswords();
            const datesValid = validateDates(); // Ensure this is called and checked

            // Check HTML5 validation status
            if (!this.checkValidity() || !passwordsValid || !datesValid) {
                // Create a general error message element if it doesn't exist
                let generalErrorDiv = document.getElementById('formGeneralError');
                if (!generalErrorDiv) {
                    generalErrorDiv = document.createElement('div');
                    generalErrorDiv.id = 'formGeneralError';
                    generalErrorDiv.style.color = 'red';
                    generalErrorDiv.style.marginBottom = '1rem';
                    this.insertBefore(generalErrorDiv, this.firstChild);
                }
                const lang = document.documentElement.lang || 'fr';
                generalErrorDiv.textContent = lang === 'fr' ? "Veuillez corriger les erreurs dans le formulaire." : "Please correct the errors in the form.";
                
                // Optionally, scroll to the first invalid field
                const firstInvalidField = this.querySelector(':invalid');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                return; // Stop submission
            }

            // If all validations pass
            const generalErrorDiv = document.getElementById('formGeneralError');
            if(generalErrorDiv) generalErrorDiv.textContent = '';


            // Collect form data
            const formData = new FormData(this);
            const eventData = {};
            formData.forEach((value, key) => {
                eventData[key] = value;
            });

            // For demonstration: log data to console
            console.log("Form Submitted Successfully!");
            console.log("Event Data:", eventData);

            // Here you would typically send data to a server:
            // fetch('/api/create-event', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(eventData)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     console.log('Success:', data);
            //     alert(document.documentElement.lang === 'fr' ? 'Événement créé avec succès !' : 'Event created successfully!');
            //     createEventForm.reset(); // Reset form
            //     // Trigger updates for dynamic fields after reset
            //     if (eventDescriptionTextarea) eventDescriptionTextarea.dispatchEvent(new Event('input'));
            //     if (numMenusSelect) numMenusSelect.dispatchEvent(new Event('change'));
            //     if (isPaidEventCheckbox) isPaidEventCheckbox.dispatchEvent(new Event('change'));
            // })
            // .catch((error) => {
            //     console.error('Error:', error);
            //     alert(document.documentElement.lang === 'fr' ? 'Erreur lors de la création de l\'événement.' : 'Error creating event.');
            // });

            // --- Placeholder for success ---
            const lang = document.documentElement.lang || 'fr';
            alert(lang === 'fr' ? 'Événement créé (simulation) ! Vérifiez la console pour les données.' : 'Event created (simulation)! Check console for data.');
            // createEventForm.reset(); // Uncomment when ready
            // Manually trigger updates for fields that need it after reset
            // eventDescriptionTextarea.dispatchEvent(new Event('input'));
            // numMenusSelect.dispatchEvent(new Event('change'));
            // isPaidEventCheckbox.dispatchEvent(new Event('change'));
        });

        createEventForm.addEventListener('reset', function() {
            // Reset custom validation messages and dynamic elements
            confirmAdminPasswordInput.setCustomValidity('');
            const generalErrorDiv = document.getElementById('formGeneralError');
            if(generalErrorDiv) generalErrorDiv.textContent = '';

            // Delay these to allow form to reset first
            setTimeout(() => {
                if (eventDescriptionTextarea) eventDescriptionTextarea.dispatchEvent(new Event('input'));
                if (numMenusSelect) generateMenuInputs(parseInt(numMenusSelect.options[numMenusSelect.selectedIndex].value, 10)); // Reset to default selected
                if (isPaidEventCheckbox) {
                    isPaidEventCheckbox.checked = false; // Ensure it's visually unchecked
                    isPaidEventCheckbox.dispatchEvent(new Event('change'));
                }
                 // Reset date custom validity
                document.getElementById('eventEndDate').setCustomValidity("");
                document.getElementById('registrationDeadlineDate').setCustomValidity("");
            }, 0);
        });
    }

    console.log("create-event.js loaded and initialized.");
});
