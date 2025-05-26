// --- MonRdvFacile - js/create-event.js ---
// --- Handles interactivity and validation for the create event form ---
// --- Updated to generate Event ID and save to localStorage ---

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

    // --- Helper: Bilingual Messages ---
    const messages = {
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
        formErrors: {
            fr: "Veuillez corriger les erreurs dans le formulaire.",
            en: "Please correct the errors in the form."
        },
        eventCreatedSuccess: {
            fr: "Événement créé avec succès ! Votre ID d'Événement est : ",
            en: "Event created successfully! Your Event ID is: "
        },
        eventCreatedNote: {
            fr: "Veuillez conserver cet ID précieusement pour toute modification future.",
            en: "Please keep this ID safe for future edits."
        },
        localStorageError: {
            fr: "Erreur : Impossible de sauvegarder l'événement. Le stockage local n'est peut-être pas disponible ou plein.",
            en: "Error: Could not save event. Local storage might be unavailable or full."
        }
    };

    function getMessage(key, lang) {
        lang = lang || document.documentElement.lang || 'fr';
        return messages[key] ? (messages[key][lang] || messages[key]['fr']) : "Message non défini.";
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
                charCountDisplay.style.color = '#6C757D';
            }
        });
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
        menuNameInputsContainer.innerHTML = '';
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
        generateMenuInputs(parseInt(numMenusSelect.value, 10));
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                if (numMenusSelect && menuNameInputsContainer) {
                     generateMenuInputs(parseInt(numMenusSelect.value, 10));
                }
                if (eventDescriptionTextarea && charCountDisplay) {
                    eventDescriptionTextarea.dispatchEvent(new Event('input'));
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
                eventPriceInput.value = '';
            }
        });
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
            confirmAdminPasswordInput.setCustomValidity(getMessage('passwordMismatch', lang));
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

        const startDate = new Date(startDateInput.value + "T" + (document.getElementById('eventStartTime').value || "00:00"));
        const endDate = new Date(endDateInput.value + "T" + (document.getElementById('eventEndTime').value || "00:00"));
        const deadlineDate = new Date(deadlineDateInput.value + "T" + (document.getElementById('registrationDeadlineTime').value || "00:00"));


        endDateInput.setCustomValidity("");
        deadlineDateInput.setCustomValidity("");

        if (startDateInput.value && endDateInput.value && document.getElementById('eventStartTime').value && document.getElementById('eventEndTime').value && endDate < startDate) {
            endDateInput.setCustomValidity(getMessage('endDateBeforeStart', lang));
            isValid = false;
        }

        if (startDateInput.value && deadlineDateInput.value && document.getElementById('eventStartTime').value && document.getElementById('registrationDeadlineTime').value && deadlineDate > startDate) {
            deadlineDateInput.setCustomValidity(getMessage('deadlineAfterStart', lang));
            isValid = false;
        }
        return isValid;
    }

    ['eventStartDate', 'eventStartTime', 'eventEndDate', 'eventEndTime', 'registrationDeadlineDate', 'registrationDeadlineTime'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', validateDates);
    });

    // --- Function to display messages on the form ---
    function displayFormMessage(message, type = 'error') {
        let messageDiv = document.getElementById('formGeneralMessage');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'formGeneralMessage';
            // Insert after the h1 title, before the form or language toggle
            const mainTitle = document.querySelector('.form-container .main-title');
            if (mainTitle && mainTitle.parentNode) {
                 mainTitle.parentNode.insertBefore(messageDiv, mainTitle.nextSibling.nextSibling); // after title and lang toggle
            } else {
                createEventForm.parentNode.insertBefore(messageDiv, createEventForm);
            }
        }
        messageDiv.innerHTML = message; // Use innerHTML to allow for bold tags or multiple lines
        messageDiv.className = `form-message form-message-${type}`; // for styling
        // Basic styling for message types (can be moved to CSS)
        messageDiv.style.padding = '10px';
        messageDiv.style.marginBottom = '15px';
        messageDiv.style.borderRadius = '4px';
        messageDiv.style.border = '1px solid';
        if (type === 'success') {
            messageDiv.style.color = '#155724';
            messageDiv.style.backgroundColor = '#D4EDDA';
            messageDiv.style.borderColor = '#C3E6CB';
        } else { // error
            messageDiv.style.color = '#721C24';
            messageDiv.style.backgroundColor = '#F8D7DA';
            messageDiv.style.borderColor = '#F5C6CB';
        }
    }


    // --- 6. Form Submission ---
    if (createEventForm) {
        createEventForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const lang = document.documentElement.lang || 'fr';

            // Clear previous messages
            const existingMessageDiv = document.getElementById('formGeneralMessage');
            if (existingMessageDiv) existingMessageDiv.innerHTML = ''; existingMessageDiv.className='form-message';


            const passwordsValid = validatePasswords();
            const datesValid = validateDates();

            if (!this.checkValidity() || !passwordsValid || !datesValid) {
                displayFormMessage(getMessage('formErrors', lang), 'error');
                const firstInvalidField = this.querySelector(':invalid:not(fieldset)'); // Exclude fieldset
                if (firstInvalidField) {
                    firstInvalidField.focus();
                    // Scroll into view if needed, especially for elements low on the page
                    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // --- START: New localStorage and Event ID logic ---
            const eventID = `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const formData = new FormData(this);
            const eventData = { id: eventID }; // Add eventID to the data
            formData.forEach((value, key) => {
                eventData[key] = value;
            });

            try {
                // For demonstration, store the raw password. In a real app, hash it before storage.
                localStorage.setItem(eventID, JSON.stringify(eventData));
                console.log("Event Data Saved to localStorage:", eventData);

                // Display success message with Event ID
                let successMsg = `${getMessage('eventCreatedSuccess', lang)} <strong>${eventID}</strong>`;
                successMsg += `<br><small>${getMessage('eventCreatedNote', lang)}</small>`;
                displayFormMessage(successMsg, 'success');

                createEventForm.reset(); // Reset form fields
                // Manually trigger updates for fields that need it after reset
                if (eventDescriptionTextarea) eventDescriptionTextarea.dispatchEvent(new Event('input'));
                if (numMenusSelect) numMenusSelect.dispatchEvent(new Event('change'));
                if (isPaidEventCheckbox) isPaidEventCheckbox.dispatchEvent(new Event('change'));

            } catch (e) {
                console.error("Error saving to localStorage:", e);
                displayFormMessage(getMessage('localStorageError', lang) + (e.message ? `<br><small>${e.message}</small>` : ''), 'error');
            }
            // --- END: New localStorage and Event ID logic ---
        });

        createEventForm.addEventListener('reset', function() {
            const lang = document.documentElement.lang || 'fr';
            if(confirmAdminPasswordInput) confirmAdminPasswordInput.setCustomValidity('');

            const messageDiv = document.getElementById('formGeneralMessage');
            if (messageDiv) {
                messageDiv.innerHTML = '';
                messageDiv.className = 'form-message'; // Reset class
                messageDiv.removeAttribute('style'); // Clear inline styles
            }

            setTimeout(() => {
                if (eventDescriptionTextarea) eventDescriptionTextarea.dispatchEvent(new Event('input'));
                if (numMenusSelect) generateMenuInputs(parseInt(numMenusSelect.options[numMenusSelect.selectedIndex].value, 10));
                if (isPaidEventCheckbox) {
                    isPaidEventCheckbox.checked = false;
                    isPaidEventCheckbox.dispatchEvent(new Event('change'));
                }
                document.getElementById('eventEndDate').setCustomValidity("");
                document.getElementById('registrationDeadlineDate').setCustomValidity("");
            }, 0);
        });
    }
    console.log("create-event.js updated version loaded and initialized.");
});
