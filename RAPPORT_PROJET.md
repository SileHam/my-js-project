# RAPPORT DE PROJET
## Application Web E-Commerce en JavaScript

---

**Titre du Projet :** Application Web E-Commerce avec JavaScript Vanilla

**Auteur :** [Votre Nom]

**Date :** Décembre 2024

**Contexte :** Projet de contrôle continu - Développement Web JavaScript

---

## TABLE DES MATIÈRES

1. [Introduction](#1-introduction)
2. [Analyse](#2-analyse)
3. [Réalisation](#3-réalisation)
4. [Fonctionnalités Avancées](#4-fonctionnalités-avancées)
5. [Tests et Validation](#5-tests-et-validation)
6. [Conclusion](#6-conclusion)
7. [Annexes](#7-annexes)

---

## 1. INTRODUCTION

### 1.1 Contexte

Ce projet s'inscrit dans le cadre d'un cours de développement web JavaScript. L'objectif était de développer une application web complète en utilisant uniquement JavaScript natif (ES6+), HTML5 et CSS3, sans frameworks modernes comme React, Angular ou Vue.js.

### 1.2 Thème Choisi

Le thème choisi est une **application e-commerce** permettant la gestion complète d'une boutique en ligne. Cette application permet de gérer les produits, catégories, commandes, utilisateurs et avis clients.

### 1.3 Objectifs

- Développer au moins 5 entités CRUD complètes
- Créer un tableau de bord avec statistiques et minimum 5 graphiques
- Implémenter un système d'authentification
- Assurer l'internationalisation (3 langues : Français, Arabe, Anglais)
- Garantir un design responsive et professionnel
- Utiliser uniquement JavaScript natif (ES6+)

---

## 2. ANALYSE

### 2.1 Entités du Système

L'application gère **5 entités principales** :

1. **Produits** : Gestion du catalogue produits (titre, SKU, prix, quantité, catégorie, description, note)
2. **Catégories** : Organisation des produits par catégories (nom, description)
3. **Commandes** : Gestion des commandes clients (utilisateur, articles, total, statut, date)
4. **Utilisateurs** : Gestion des comptes utilisateurs (nom, email, mot de passe, rôle)
5. **Avis** : Système d'évaluation des produits (produit, utilisateur, note, commentaire, date)

### 2.2 Schéma de Navigation

```
index.html (Login)
    ↓
dashboard.html (Tableau de bord)
    ├── products.html (Liste Produits)
    │   └── productDetail.html (Détails Produit)
    ├── categories.html (Liste Catégories)
    │   └── categoryDetail.html (Détails Catégorie)
    ├── orders.html (Liste Commandes)
    │   └── orderDetail.html (Détails Commande)
    ├── users.html (Liste Utilisateurs)
    │   └── userDetail.html (Détails Utilisateur)
    └── reviews.html (Liste Avis)
        └── reviewDetail.html (Détails Avis)
```

### 2.3 Architecture Technique

**Structure des fichiers :**
```
ecommerce-js/
├── css/
│   └── styles.css (Styles principaux avec variables CSS, dark mode, responsive)
├── js/
│   ├── data.js (Gestion localStorage, CRUD operations)
│   ├── auth.js (Authentification et session)
│   ├── utils.js (Fonctions utilitaires)
│   ├── i18n.js (Système d'internationalisation)
│   ├── dashboard.js (Logique du tableau de bord)
│   ├── products.js (CRUD produits)
│   ├── categories.js (CRUD catégories)
│   ├── orders.js (CRUD commandes)
│   ├── users.js (CRUD utilisateurs)
│   └── reviews.js (CRUD avis)
├── lang/
│   ├── fr.json (Traductions françaises)
│   ├── en.json (Traductions anglaises)
│   └── ar.json (Traductions arabes)
└── *.html (Pages de l'application)
```

### 2.4 Technologies Utilisées

- **HTML5** : Structure sémantique, validation W3C
- **CSS3** : Flexbox, Grid, variables CSS, media queries
- **JavaScript ES6+** : Classes, modules, async/await, arrow functions
- **Bibliothèques externes** :
  - Chart.js (graphiques)
  - SweetAlert2 (modals élégantes)
  - html2pdf.js (export PDF)

---

## 3. RÉALISATION

### 3.1 Système d'Authentification

**Fichier :** `js/auth.js`

Le système d'authentification utilise localStorage pour stocker les sessions. Deux utilisateurs par défaut sont créés :
- Admin : `admin@app.com` / `admin123`
- User : `user@app.com` / `user123`

**Fonctionnalités :**
- Validation en temps réel des champs email et mot de passe
- Messages d'erreur traduits
- Redirection automatique si non authentifié
- Gestion de session avec `requireAuth()`

### 3.2 Gestion des Données (CRUD)

**Fichier :** `js/data.js`

Toutes les opérations CRUD utilisent localStorage comme base de données :

```javascript
function getAll(entity) {
  return JSON.parse(localStorage.getItem(storeKey[entity]) || '[]');
}

function create(entity, record) {
  const arr = getAll(entity);
  if (!record.id) record.id = Date.now() + Math.floor(Math.random() * 999);
  arr.push(record);
  saveAll(entity, arr);
  return record;
}

function update(entity, id, updates) {
  const arr = getAll(entity);
  const idx = arr.findIndex(x => x.id === id);
  if (idx === -1) return null;
  arr[idx] = { ...arr[idx], ...updates };
  saveAll(entity, arr);
  return arr[idx];
}

function remove(entity, id) {
  const arr = getAll(entity).filter(x => x.id !== id);
  saveAll(entity, arr);
}
```

### 3.3 Internationalisation (i18n)

**Fichier :** `js/i18n.js`

Le système i18n charge dynamiquement les fichiers JSON de traduction et applique les traductions aux éléments avec les attributs `data-i18n`, `data-i18n-placeholder`, `data-i18n-title`.

**Support RTL :** La direction du document est automatiquement changée en RTL pour l'arabe.

### 3.4 Tableau de Bord

**Fichier :** `js/dashboard.js`

Le dashboard affiche :
- **6 cartes KPI** : Produits, Catégories, Utilisateurs, Commandes, CA total, Avis
- **5 graphiques** :
  1. Pie Chart : Produits par catégorie
  2. Donut Chart : Commandes par statut
  3. Bar Chart : Ventes par mois
  4. Line Chart : CA (ligne)
  5. Scatter Plot : Ratings vs Nombre d'avis

**Filtres dynamiques :**
- Filtre par période (jour, semaine, mois, année)
- Filtre par catégorie
- Mise à jour automatique des graphiques

### 3.5 Fonctionnalités CRUD Complètes

Chaque entité dispose de :

**1. Liste avec :**
- Pagination (10, 25, 50 éléments/page)
- Tri par colonnes (ascendant/descendant)
- Filtres multiples (catégorie, statut, rôle, note)
- Recherche en temps réel avec debouncing (300ms)
- Export CSV

**2. Formulaire de création/modification :**
- Validation en temps réel
- Messages d'erreur traduits
- Confirmation avec SweetAlert2

**3. Page de détails :**
- Informations complètes
- Export PDF
- Boutons : Retour, Modifier, Supprimer

**4. Suppression :**
- Modal de confirmation SweetAlert2
- Vérifications (ex: ne pas supprimer une catégorie avec produits)

### 3.6 Design Responsive

**Fichier :** `css/styles.css`

Le design utilise :
- **Variables CSS** pour le thème (light/dark)
- **Flexbox et Grid** pour la mise en page
- **Media queries** pour le responsive :
  - Desktop : > 1024px
  - Tablette : 768px - 1024px
  - Mobile : < 768px

**Dark Mode :** Système complet avec variables CSS et sauvegarde dans localStorage.

---

## 4. FONCTIONNALITÉS AVANCÉES

### 4.1 Défis Rencontrés

**Défi 1 : Gestion de l'état des graphiques**
- **Problème :** Les graphiques Chart.js doivent être détruits avant d'être recréés
- **Solution :** Utilisation d'un tableau `chartInstances` pour stocker les instances et les détruire avant recréation

**Défi 2 : Internationalisation dynamique**
- **Problème :** Mettre à jour tous les textes lors du changement de langue
- **Solution :** Système d'attributs `data-i18n` avec fonction `applyTranslations()` qui parcourt tous les éléments

**Défi 3 : Validation en temps réel**
- **Problème :** Afficher les erreurs au bon moment sans être intrusif
- **Solution :** Validation au `blur` avec affichage d'erreur et nettoyage au `input`

**Défi 4 : Pagination avec tri et filtres**
- **Problème :** Maintenir l'état de la pagination lors des changements de filtres
- **Solution :** Réinitialisation à la page 1 lors du changement de filtres, utilisation des URLSearchParams pour la pagination

### 4.2 Solutions Techniques

**Debouncing pour la recherche :**
```javascript
function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
```

**Tri générique :**
```javascript
function sortArray(array, key, direction = 'asc') {
  const sorted = [...array];
  sorted.sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (direction === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
  return sorted;
}
```

**Export CSV :**
```javascript
function exportCSV(filename, rows) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(',')].concat(
    rows.map(r => keys.map(k => `"${String(r[k] || '').replace(/"/g, '""')}"`).join(','))
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

## 5. TESTS ET VALIDATION

### 5.1 Validation W3C

Tous les fichiers HTML ont été validés avec le validateur W3C. Aucune erreur majeure détectée.

### 5.2 Tests Responsive

**Desktop (1920x1080) :** ✅ Tous les éléments s'affichent correctement
**Tablette (768x1024) :** ✅ Sidebar masquée, layout adapté
**Mobile (375x667) :** ✅ Navigation optimisée, formulaires adaptés

### 5.3 Tests de Compatibilité Navigateurs

- **Chrome 120+** : ✅ Fonctionne parfaitement
- **Firefox 121+** : ✅ Fonctionne parfaitement
- **Edge 120+** : ✅ Fonctionne parfaitement
- **Safari 17+** : ✅ Fonctionne parfaitement

### 5.4 Tests Fonctionnels

**Authentification :**
- ✅ Connexion avec identifiants valides
- ✅ Rejet des identifiants invalides
- ✅ Redirection si non authentifié
- ✅ Déconnexion fonctionnelle

**CRUD Produits :**
- ✅ Création avec validation
- ✅ Liste avec pagination, tri, filtres
- ✅ Modification avec formulaire pré-rempli
- ✅ Suppression avec confirmation
- ✅ Export CSV fonctionnel

**Dashboard :**
- ✅ Affichage des KPI
- ✅ Graphiques interactifs
- ✅ Filtres dynamiques fonctionnels

**Internationalisation :**
- ✅ Changement de langue fonctionnel
- ✅ RTL pour l'arabe
- ✅ Tous les textes traduits

---

## 6. CONCLUSION

### 6.1 Bilan du Projet

Ce projet a permis de développer une application web complète en JavaScript vanilla, démontrant la maîtrise des technologies web fondamentales. Tous les objectifs ont été atteints :

- ✅ 5 entités CRUD complètes
- ✅ Dashboard avec 6 KPI et 5 graphiques
- ✅ Système d'authentification fonctionnel
- ✅ Internationalisation complète (FR, EN, AR)
- ✅ Design responsive et professionnel
- ✅ Code JavaScript ES6+ uniquement

### 6.2 Compétences Acquises

**Techniques :**
- Manipulation avancée du DOM
- Gestion d'état avec localStorage
- Programmation asynchrone (async/await)
- Gestion d'événements et délégation
- Validation de formulaires
- Création de graphiques avec Chart.js
- Export de données (CSV, PDF)

**Architecture :**
- Organisation modulaire du code
- Séparation des responsabilités
- Réutilisabilité des fonctions
- Gestion d'erreurs

**UX/UI :**
- Design responsive
- Dark mode
- Internationalisation
- Feedback utilisateur (SweetAlert2)

### 6.3 Améliorations Possibles

- Backend avec API REST pour la persistance réelle
- Tests unitaires avec Jest
- Service Worker pour le mode hors ligne
- Système de permissions/rôles plus avancé
- Recherche avancée avec filtres multiples
- Historique des modifications

---

## 7. ANNEXES

### 7.1 Extrait de Code : Gestion CRUD

```javascript
// data.js - Fonctions CRUD génériques
const storeKey = {
  products: 'ecom_products',
  categories: 'ecom_categories',
  orders: 'ecom_orders',
  reviews: 'ecom_reviews',
  users: 'ecom_users'
};

function getAll(entity) {
  return JSON.parse(localStorage.getItem(storeKey[entity]) || '[]');
}

function saveAll(entity, arr) {
  localStorage.setItem(storeKey[entity], JSON.stringify(arr));
}

function create(entity, record) {
  const arr = getAll(entity);
  if (!record.id) record.id = Date.now() + Math.floor(Math.random() * 999);
  arr.push(record);
  saveAll(entity, arr);
  return record;
}
```

### 7.2 Extrait de Code : Internationalisation

```javascript
// i18n.js - Système d'internationalisation
let currentLang = 'fr';
let translations = {};

async function loadLang(lang = 'fr') {
  try {
    const res = await fetch(`lang/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
    localStorage.setItem('ecom_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    applyTranslations();
  } catch (err) {
    console.warn('Lang load failed', err);
  }
}

function t(key) {
  return translations[key] || key;
}
```

### 7.3 Structure des Données

**Produit :**
```json
{
  "id": 201,
  "title": "Smartphone X",
  "sku": "SMX-01",
  "price": 399.99,
  "qty": 12,
  "categoryId": 101,
  "description": "Téléphone moderne",
  "rating": 4.2
}
```

**Commande :**
```json
{
  "id": 300,
  "userId": 1,
  "items": [
    {
      "productId": 201,
      "qty": 1,
      "price": 399.99
    }
  ],
  "total": 399.99,
  "status": "pending",
  "date": "2024-12-01T10:00:00.000Z"
}
```

### 7.4 Captures d'Écran

*[Les captures d'écran seraient insérées ici dans le rapport final]*

---

**Fin du Rapport**

