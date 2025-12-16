# Instructions pour convertir les documents

## Conversion du Rapport (RAPPORT_PROJET.md)

### Option 1 : Utiliser Pandoc (Recommandé)

```bash
# Installer Pandoc si nécessaire
# Windows : choco install pandoc
# Mac : brew install pandoc
# Linux : sudo apt-get install pandoc

# Convertir en PDF
pandoc RAPPORT_PROJET.md -o RAPPORT_PROJET.pdf --pdf-engine=xelatex -V geometry:margin=1in

# Ou avec wkhtmltopdf
pandoc RAPPORT_PROJET.md -o RAPPORT_PROJET.pdf --pdf-engine=wkhtmltopdf
```

### Option 2 : Utiliser un éditeur Markdown

1. Ouvrir `RAPPORT_PROJET.md` dans :
   - **Typora** : Fichier → Exporter → PDF
   - **MarkText** : Fichier → Exporter → PDF
   - **VS Code** avec extension Markdown PDF

### Option 3 : Conversion en ligne

- Utiliser [Dillinger](https://dillinger.io/) ou [Markdown to PDF](https://www.markdowntopdf.com/)

### Ajouter la page de garde

Dans le PDF final, ajouter :
- Titre du projet
- Votre nom
- Date
- Logos de l'établissement (si requis)

---

## Conversion de la Présentation (PRESENTATION.md)

### Option 1 : Créer manuellement dans PowerPoint

1. Ouvrir PowerPoint
2. Créer 12 slides
3. Copier le contenu de chaque slide depuis `PRESENTATION.md`
4. Ajouter des images/icônes si nécessaire
5. Appliquer un thème professionnel

### Option 2 : Utiliser Marp

```bash
# Installer Marp CLI
npm install -g @marp-team/marp-cli

# Convertir en PowerPoint
marp PRESENTATION.md --pptx -o PRESENTATION.pptx

# Ou en PDF
marp PRESENTATION.md --pdf -o PRESENTATION.pdf
```

### Option 3 : Utiliser Reveal.js

```bash
# Installer Reveal.js
npm install -g reveal-md

# Convertir en HTML
reveal-md PRESENTATION.md --static PRESENTATION.html
```

### Option 4 : Créer dans Google Slides

1. Créer une nouvelle présentation Google Slides
2. Copier le contenu slide par slide
3. Télécharger en format PowerPoint (.pptx)

---

## Structure recommandée pour PowerPoint

### Design
- Utiliser un thème professionnel (bleu/blanc ou sombre)
- Police : Arial, Calibri ou Inter
- Taille : Titre 44pt, Contenu 24-32pt

### Contenu par slide
1. **Page de garde** : Titre, nom, date, logo
2. **Objectifs** : Liste à puces avec icônes
3. **Architecture** : Schéma ou diagramme
4. **Entités** : Tableau ou liste
5. **Dashboard** : Capture d'écran ou schéma
6. **Authentification** : Capture d'écran
7. **i18n** : Capture d'écran des 3 langues
8. **Design** : Captures responsive
9. **Fonctionnalités** : Liste avec icônes
10. **Défis** : Tableau problème/solution
11. **Tests** : Tableau de résultats
12. **Conclusion** : Bilan et compétences

### Captures d'écran à ajouter

1. Page de connexion
2. Dashboard avec graphiques
3. Liste des produits avec filtres
4. Formulaire de création
5. Page de détails
6. Changement de langue (3 captures)
7. Mode sombre
8. Version mobile

---

## Conseils pour la présentation

### Timing
- **10 minutes maximum** de présentation
- ~1 minute par slide
- Laisser du temps pour les questions

### Points à mettre en avant
- Architecture modulaire
- Code JavaScript vanilla uniquement
- Fonctionnalités complètes CRUD
- Design responsive
- Internationalisation

### Démonstration live
- Montrer le dashboard avec filtres
- Créer/modifier un produit
- Changer de langue
- Montrer le mode sombre
- Exporter un CSV/PDF

---

## Checklist avant soumission

### Rapport PDF
- [ ] Page de garde avec titre, nom, date
- [ ] Table des matières
- [ ] 8-12 pages de contenu
- [ ] Captures d'écran insérées
- [ ] Code formaté correctement
- [ ] Aucune faute d'orthographe

### Présentation PowerPoint
- [ ] 10-12 slides
- [ ] Design professionnel
- [ ] Captures d'écran
- [ ] Contenu structuré
- [ ] Animations discrètes (optionnel)

### Code source
- [ ] Tous les fichiers présents
- [ ] Structure organisée
- [ ] Commentaires dans le code
- [ ] README.md complet

---

**Bon courage pour la présentation ! 🚀**

