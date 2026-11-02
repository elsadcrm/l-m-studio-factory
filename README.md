# L&M Studio Factory

Je souhaite créer un logiciel web privé, réservé à mon usage personnel, appelé L&M STUDIO FACTORY.

Ce logiciel est mon atelier de création, de production et de gestion pour une marque créative appelée Leny & Miam Studio (signature : L&M Studio).

1. Objectif principal

Je ne souhaite PAS créer une application destinée au public, ni une boutique en ligne.

Je veux un outil interne ergonomique qui me permette de piloter toute la création de mes produits : livres de coloriage, illustrations, motifs, papeterie, stickers, accessoires et coffrets créatifs.

Je ne suis pas développeuse. L'interface doit être intuitive, visuelle, agréable, entièrement en français et utilisable sans aucune compétence technique.

Je veux pouvoir superviser la création et valider les images, mais ne pas avoir à effectuer manuellement les tâches répétitives de mise en page, d'assemblage ou de préparation des fichiers.

2. Direction artistique de l'interface

Créer un univers graphique contemporain, japonais kawaii et cozy, élégant, doux et créatif, mais surtout pas infantile.

Palette :

rose poudré ;

pêche ;

lavande ;

jaune beurre ;

vert sauge ;

crème ;

brun cacao.

Interface claire, organisée, avec des cartes illustrées, des galeries visuelles, des aperçus, des boutons explicites et une navigation latérale.

Typographie arrondie et très lisible. Éviter les interfaces professionnelles froides, les tableaux de données omniprésents et les menus compliqués.

3. Structure générale

Prévoir les rubriques suivantes :

Tableau de bord

Direction artistique L&M

Personnages

Collections

Livres de coloriage

Atelier de création d'images

Patterns & Textures

Papeterie & Stickers

Goodies & Accessoires

Creative Kits

Bibliothèque de fichiers

Production et contrôle qualité

Diffusion et plateformes

Paramètres

4. Le module prioritaire : Livres de coloriage

C'est la fonctionnalité centrale de la première version.

Je veux pouvoir créer un projet de livre en indiquant :

son titre ;

sa collection ;

son univers graphique ;

son nombre de pages ;

son format : carré, A4, A5 ou format personnalisé ;

son type de contenu ;

ses consignes graphiques particulières.

Le logiciel doit ensuite organiser la production des illustrations page par page.

Chaque illustration doit pouvoir être examinée individuellement.

Prévoir pour chaque page :

aperçu grand format ;

numéro de page ;

prompt utilisé ;

statut : à générer, à vérifier, validée, à corriger, refusée ;

bouton Valider ;

bouton Demander une correction ;

bouton Régénérer ;

possibilité d'ajouter un commentaire.

Une page ne doit jamais être intégrée automatiquement au livre sans ma validation explicite.

5. Assemblage automatique

Lorsque toutes les pages sont validées, le logiciel doit pouvoir :

les assembler dans l'ordre ;

appliquer automatiquement les dimensions choisies ;

respecter les marges d'impression ;

vérifier les dimensions et la résolution des images ;

générer le PDF intérieur ;

préparer le fichier de couverture adapté au prestataire sélectionné ;

conserver les illustrations originales individuellement.

Je ne veux pas devoir assembler les pages dans Canva ou dans un autre logiciel.

6. Collections initiales

Créer les collections suivantes :

Boo's Cozy World

L&M Cozy Patterns

L&M Cozy Textures

Little Seasons

Kawaii Everyday

Cozy Afternoon

Spooky but Cute

7. Personnages

Prévoir une fiche de référence permanente pour chaque personnage, avec :

description physique ;

personnalité ;

vêtements ;

accessoires ;

couleurs ;

éléments graphiques invariants ;

expressions ;

poses de référence ;

images de référence validées.

Les personnages principaux sont Boo et Rosa Pouce.

Les caractéristiques validées devront être conservées et réutilisées dans les futurs prompts de génération.

8. Produits dérivés

Prévoir dès maintenant la structure des modules pour les produits suivants, mais ne pas développer leurs fonctions complexes dans cette première étape :

stickers ;

marque-pages ;

cartes ;

affiches ;

papeterie ;

accessoires ;

porte-clés ;

goodies ;

kits créatifs.

L'objectif sera de pouvoir décliner une illustration ou une collection en plusieurs produits sans repartir de zéro.

9. Bibliothèque

Prévoir une bibliothèque centralisée permettant de retrouver :

les images originales ;

les images validées ;

les pages de livres ;

les couvertures ;

les PDF terminés ;

les fichiers destinés aux fabricants ;

les références graphiques.

Chaque fichier doit être associé à son projet, sa collection et son statut.

10. Contraintes techniques et financières

Je veux commencer avec le plan gratuit et limiter au maximum les coûts.

En conséquence :

ne souscris à aucun service payant ;

ne crée aucune API payante ;

ne connecte aucun fournisseur externe sans mon accord ;

ne suppose pas qu'un générateur d'images est inclus gratuitement ;

privilégie les fonctionnalités natives et les solutions gratuites ;

prévois une architecture modulaire permettant d'ajouter ultérieurement des générateurs IA, des services PDF et des plateformes commerciales.

Je veux pouvoir récupérer mes données et mes fichiers. Éviter autant que possible de rendre le logiciel dépendant d'un seul fournisseur.

11. Ce que j'attends de toi maintenant

Pour le moment, NE CONSTRUIS PAS encore l'application.

Présente-moi d'abord :

L'architecture générale proposée.

Les écrans et leur organisation.

Le fonctionnement précis du parcours de création d'un livre.

Les solutions techniques envisagées pour le stockage, les images et l'assemblage PDF.

Les fonctionnalités réalisables gratuitement.

Les fonctionnalités qui nécessiteront probablement un service payant.

Les éventuelles limites ou difficultés techniques.

Je souhaite valider cette architecture avant de commencer le développement.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2d8920f2-2231-4dec-af9c-6095c385d1a5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
