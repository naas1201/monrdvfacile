# MonRdvFacile - Event Management Platform

## 🇫🇷 Description du Projet (French First)

**MonRdvFacile** est une application web conçue pour simplifier la création, la gestion, et l'inscription à des événements. Elle cible particulièrement les utilisateurs seniors et les associations de la région de Royan et de la Charente-Maritime (17), en France. L'objectif est de fournir une interface claire, conviviale, et accessible, sans l'utilisation d'images pour la conception principale, tout en offrant un aspect professionnel et moderne.

L'application permet aux administrateurs de configurer des événements avec une multitude de détails (nom, organisateur, description, dates, lieu physique ou en ligne, configuration de la salle, options de menu détaillées, tarification, etc.) et de gérer les inscriptions via un tableau de bord. Les utilisateurs peuvent facilement consulter les événements à venir et s'inscrire.

## 🇬🇧 Project Description

**MonRdvFacile** is a web application designed to simplify the creation, management, and registration for events. It particularly targets senior users and associations in the Royan and Charente-Maritime (17) region of France. The goal is to provide a clear, user-friendly, and accessible interface, without the use of images for the main design, while maintaining a professional and modern look.

The application allows administrators to set up events with a wealth of details (name, organizer, description, dates, physical or online location, venue setup, detailed menu options, pricing, etc.) and manage registrations through a dashboard. Users can easily view upcoming events and register for them.

## ✨ Fonctionnalités Principales / Key Features

* **Création d'Événements Détaillée / Detailed Event Creation:**
    * Nom, organisateur (optionnel), description.
    * Dates et heures de début/fin (heures optionnelles).
    * Date et heure limite d'inscription (heure optionnelle).
    * Option d'événement récurrent avec règle de récurrence.
    * Type de lieu : Physique (nom du lieu, adresse, lien Google Maps optionnel) ou En Ligne (lien de la réunion).
    * Configuration de la salle : Nombre de tables, chaises par table.
    * Option pour permettre aux utilisateurs de choisir leur siège (fonctionnalité d'interface utilisateur pour la sélection à développer).
    * **Menu Détaillé Dynamique :** Création de sections de menu (ex: Entrées, Plats, Boissons) avec des éléments et prix optionnels par élément.
    * Tarification : Événement payant ou gratuit, avec champ de prix.
    * Badges d'événement (ex: Nouveau, Populaire, Spécial, AFA, Payant, En Ligne).
    * Mot de passe administrateur pour l'édition et la gestion.
    * Options avancées : Limite d'inscriptions par utilisateur, activation de liste d'attente.
* **Page d'Affichage d'Événement / Event Display Page:**
    * Présentation claire des détails de l'événement.
    * Affichage de la structure du menu détaillé.
    * Formulaire d'inscription simple et accessible.
    * Options de partage (copier le lien, WhatsApp).
* **Page de Confirmation de Création / Event Creation Confirmation Page:**
    * Récapitulatif clair des informations de l'événement créé (ID, lien de partage, lien d'administration).
    * Instructions pour l'administrateur.
* **Page d'Édition d'Événement (Admin) / Event Edit Page (Admin):**
    * Authentification par ID d'événement et mot de passe.
    * Modification de tous les détails de l'événement, y compris la structure du menu.
    * **Tableau de Bord Visuel :**
        * Statistiques d'inscription (capacité, inscrits, places restantes) avec barres de progression.
        * Visualisation des tables et des sièges (disponibles/réservés).
        * Répartition des choix de menu.
    * **Gestion des Participants :**
        * Liste des inscrits.
        * Exportation de la liste des inscrits en CSV.
    * Affichage de la liste d'attente.
    * Option de suppression de l'événement.
* **Page d'Accueil (`index.html`) / Homepage:**
    * Liste des événements à venir, triés par date.
    * Cartes d'événements cliquables affichant les informations clés (nom, date, organisateur, lieu, badges).
    * Fonctionnalités de recherche et de filtrage (par nom, par date).
* **Interface Bilingue / Bilingual Interface:** Français (majoritaire) et Anglais.
* **Conception Accessible / Accessible Design:** Ciblant les seniors, avec une attention portée à la lisibilité et à la simplicité d'utilisation, sans images distrayantes.
* **Confirmation Imprimable / Printable Confirmation:** Option pour imprimer un résumé de l'inscription.

## 🛠️ Technologies Utilisées / Technology Stack

* **Frontend:**
    * HTML5
    * CSS3 (entièrement en ligne dans les fichiers HTML - `inline CSS`)
    * JavaScript (entièrement en ligne dans les fichiers HTML - `inline JS`)
    * Font Awesome (pour les icônes, via CDN)
* **Backend (API):**
    * Cloudflare Worker (`worker.js`)
* **Base de Données / Database:**
    * Cloudflare D1 (base de données SQL de type SQLite)
* **Structure de Fichiers (Frontend Principal) / Main Frontend File Structure:**
    ```
    /
    ├── index.html                 (Page d'accueil, liste des événements)
    ├── create-event.html          (Formulaire de création d'événement)
    ├── edit-event.html            (Page d'édition et tableau de bord admin)
    ├── event-display.html         (Page publique d'un événement et formulaire d'inscription)
    ├── event-confirmation.html    (Page de confirmation après création d'événement)
    └── src/
        └── hf.js                  (JavaScript pour injecter l'en-tête et le pied de page)
    ```
* **Analytique / Analytics:**
    * Google Analytics (via gtag.js)

## ⚙️ Configuration et Déploiement / Setup and Deployment

1.  **Base de Données D1 / D1 Database:**
    * Créez une base de données D1 dans votre compte Cloudflare.
    * Exécutez les commandes SQL `CREATE TABLE` (pour `Events`, `Registrations`, `WaitlistEntries`) et `CREATE INDEX` fournies dans la console D1 pour configurer le schéma.
    * Liez votre base de données D1 à votre Worker dans le fichier `wrangler.toml` (ou via le tableau de bord Cloudflare). Le binding utilisé dans le code du worker est généralement `DB`.
        ```toml
        # Exemple wrangler.toml
        name = "monrdvfacile-api"
        main = "worker.js" # Ou le nom de votre fichier worker principal
        compatibility_date = "YYYY-MM-DD"

        [[d1_databases]]
        binding = "DB" # Important: doit correspondre à env.DB dans le worker
        database_name = "votre-nom-de-base-de-donnees-d1"
        database_id = "votre-id-de-base-de-donnees-d1"
        ```

2.  **Cloudflare Worker (`worker.js`):**
    * Déployez le code `worker.js` fourni sur votre compte Cloudflare Workers.
    * Assurez-vous que le worker a accès à la liaison D1 (`env.DB`).
    * **Sécurité des Mots de Passe :** Le worker est conçu pour hacher les mots de passe administrateur avec un sel unique en utilisant l'API Web Crypto (PBKDF2). Ne stockez jamais de mots de passe en clair.

3.  **Frontend (Fichiers HTML):**
    * Déployez les fichiers HTML (`index.html`, `create-event.html`, etc.) et le dossier `src/` sur une plateforme d'hébergement statique (par exemple, Cloudflare Pages, GitHub Pages, Netlify, Vercel).
    * Assurez-vous que les URLs des API dans les fichiers JavaScript du frontend pointent vers votre Worker déployé (ex: `https://monrdvfacile-api.votre-domaine.workers.dev/api/...`).

## 🚀 Utilisation / How to Use

* **Administrateurs / Admins:**
    1.  Accédez à `create-event.html` pour créer un nouvel événement. Remplissez tous les détails, y compris le menu détaillé et le mot de passe administrateur.
    2.  Après la création, vous serez redirigé vers une page de confirmation affichant l'ID de l'événement, le lien de partage public et le lien d'administration. **Conservez ces informations précieusement.**
    3.  Pour modifier un événement ou consulter les inscriptions, accédez à `edit-event.html`. Vous devrez fournir l'ID de l'événement et le mot de passe administrateur pour y accéder.
* **Utilisateurs / Users:**
    1.  Accédez à `index.html` pour voir la liste des événements à venir.
    2.  Cliquez sur un événement pour voir ses détails sur la page `event-display.html`.
    3.  Remplissez le formulaire d'inscription pour participer.

## 🔮 Fonctionnalités Futures Possibles / Potential Future Enhancements

* Interface utilisateur pour la sélection des places par les participants (si activé par l'admin).
* Système de notification par e-mail pour les confirmations d'inscription et les rappels.
* Gestion plus avancée des événements récurrents (ex: exceptions, modifications d'une seule instance).
* Comptes utilisateurs pour les organisateurs d'événements.
* Interface pour la gestion des participants sur la liste d'attente (ex: les inviter si une place se libère).
* Intégration de paiement en ligne sécurisé (au lieu de la simple case à cocher "déjà payé").

## 📞 Contact

En cas de problème ou pour toute question, vous pouvez nous contacter via : [https://contact.lpp.ovh](https://contact.lpp.ovh)
