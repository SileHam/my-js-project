# Application Web E-Commerce en JavaScript

Application web complète de gestion e-commerce développée en JavaScript vanilla (ES6+), HTML5 et CSS3.

## 🚀 Fonctionnalités

### Authentification
- Page de connexion avec validation en temps réel
- Utilisateurs par défaut :
  - Admin : `admin@app.com` / `admin123`
  - User : `user@app.com` / `user123`
- Gestion de session avec localStorage

### 5 Entités CRUD Complètes
1. **Produits** : Gestion du catalogue
2. **Catégories** : Organisation des produits
3. **Commandes** : Gestion des commandes clients
4. **Utilisateurs** : Gestion des comptes
5. **Avis** : Système d'évaluation

Chaque entité dispose de :
- ✅ Liste avec pagination (10/25/50 éléments)
- ✅ Tri par colonnes (ascendant/descendant)
- ✅ Filtres multiples
- ✅ Recherche en temps réel avec debouncing
- ✅ Export CSV
- ✅ Page de détails avec export PDF
- ✅ Création, modification, suppression avec validation

### Dashboard
- 6 cartes KPI (Produits, Catégories, Utilisateurs, Commandes, CA total, Avis)
- 5 graphiques interactifs :
  - Pie Chart (Produits par catégorie)
  - Donut Chart (Commandes par statut)
  - Bar Chart (Ventes par mois)
  - Line Chart (CA ligne)
  - Scatter Plot (Ratings vs Avis)
- Filtres dynamiques (période, catégorie)

### Internationalisation
- 🇫🇷 Français (par défaut)
- 🇬🇧 Anglais
- 🇸🇦 Arabe (avec support RTL)

### Design
- Responsive (Mobile, Tablette, Desktop)
- Dark Mode
- Design moderne et professionnel

## 📁 Structure du Projet

```
ecommerce-js/
├── css/
│   └── styles.css          # Styles principaux
├── js/
│   ├── data.js            # Gestion localStorage et CRUD
│   ├── auth.js            # Authentification
│   ├── utils.js           # Fonctions utilitaires
│   ├── i18n.js            # Internationalisation
│   ├── dashboard.js        # Logique du dashboard
│   ├── products.js         # CRUD produits
│   ├── categories.js       # CRUD catégories
│   ├── orders.js          # CRUD commandes
│   ├── users.js           # CRUD utilisateurs
│   └── reviews.js         # CRUD avis
├── lang/
│   ├── fr.json            # Traductions françaises
│   ├── en.json            # Traductions anglaises
│   └── ar.json            # Traductions arabes
├── index.html             # Page de connexion
├── dashboard.html         # Tableau de bord
├── products.html          # Liste produits
├── productDetail.html     # Détails produit
├── categories.html        # Liste catégories
├── categoryDetail.html    # Détails catégorie
├── orders.html            # Liste commandes
├── orderDetail.html       # Détails commande
├── users.html             # Liste utilisateurs
├── userDetail.html        # Détails utilisateur
├── reviews.html           # Liste avis
├── reviewDetail.html      # Détails avis
├── RAPPORT_PROJET.md     # Rapport du projet
└── PRESENTATION.md        # Présentation PowerPoint
```

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Flexbox, Grid, Variables CSS, Media Queries
- **JavaScript ES6+** : Vanilla uniquement
- **Chart.js** : Graphiques interactifs
- **SweetAlert2** : Modals élégantes
- **html2pdf.js** : Export PDF

## 📖 Utilisation

1. Ouvrir `index.html` dans un navigateur web moderne
2. Se connecter avec les identifiants par défaut
3. Naviguer dans les différentes sections via le menu latéral
4. Utiliser les fonctionnalités CRUD pour chaque entité
5. Consulter le dashboard pour les statistiques

## 📋 Prérequis

- Navigateur web moderne (Chrome, Firefox, Edge, Safari)
- Serveur web local (optionnel, peut fonctionner avec `file://`)

## 📝 Notes

- Les données sont stockées dans le localStorage du navigateur
- Les données sont persistantes entre les sessions
- Pour réinitialiser les données, vider le localStorage

## 👨‍💻 Auteur

[Hamza]
---
