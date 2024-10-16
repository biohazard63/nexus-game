# Nom du Projet

Nom du Projet est une plateforme permettant aux utilisateurs de créer, rejoindre et gérer des sessions de jeux pour des jeux vidéo, jeux de société et jeux de rôle. Elle intègre diverses fonctionnalités comme le chat en direct, une wishlist de jeux, et des filtres pour découvrir des sessions publiques selon les types de jeux et genres disponibles.

## Table des Matières

	-	Fonctionnalités
	-	Technologies Utilisées
	-	Prérequis
	-	Installation
	-	Initialisation du Projet
	-	Utilisation et Maintenance
	-	Déploiement sur Vercel
	-	Contribution
	-	Licence

## Fonctionnalités

	•	Gestion des Sessions : Créez, modifiez et supprimez des sessions de jeux avec une interface utilisateur interactive.
	•	Recherche et Filtres : Recherchez des sessions publiques en fonction du type de jeu et du genre.
	•	Chat en Direct : Communiquez avec les participants d’une session en temps réel.
	•	Wishlist de Jeux : Ajoutez des jeux à une liste de souhaits pour un accès rapide.
	•	Gestion des Utilisateurs : Profils utilisateurs avec Firebase, incluant la connexion, l’inscription et la gestion des profils.

## Technologies Utilisées

	•	Frontend : Next.js 14, TypeScript, React
	•	Backend : Prisma pour la base de données, Firebase pour l’authentification
	•	Base de Données : PostgreSQL avec Prisma ORM
	•	Déploiement : Vercel

## Prérequis

	•	Node.js (version 16 ou supérieure)
	•	PostgreSQL pour la base de données
	•	Firebase pour l’authentification
	•	Vercel CLI (facultatif pour le déploiement local)

## Installation

Clonez le projet depuis le dépôt Git :git clone https://github.com/biohazard63/nexus-game.git

Accédez au répertoire du projet :



```bash
cd my-app
``` 

Installez les dépendances :
    
```bash
npm install
```

## Initialisation du Projet

1.	Configuration de l’Environnement : Copiez .env.example en .env et modifiez les valeurs selon vos configurations (Firebase, base de données, etc.).

2.	Configurer Prisma : Synchronisez Prisma avec votre base de données PostgreSQL.

```bash
      npx prisma db push
```
3.	Lancer le Projet : Utilisez la commande suivante pour démarrer le serveur de développement.
```bash
      npm run dev
```
### Le projet est maintenant disponible sur http://localhost:3000.

## Utilisation et Maintenance

### Gestion de la Base de Données

Utilisez Prisma pour la gestion de la base de données. En cas de modification du schéma, exécutez les migrations :
    
```bash
        npx prisma migrate dev --name nom_migration
```
### Requêtes de Données avec Prisma

Prisma facilite les interactions avec la base de données grâce à un ORM intuitif. Utilisez prisma.session, prisma.user, etc., dans le projet pour interagir avec les tables correspondantes.

### Authentification Firebase

Vérifiez que les configurations Firebase (ID de l’application, API_KEY, etc.) sont correctes dans .env. Firebase gère l’authentification et la gestion des utilisateurs dans l’application.

### Débogage et Logs

Utilisez console.log pour le débogage pendant le développement. En production, intégrez une solution de monitoring comme Sentry pour capturer les erreurs.

## Déploiement sur Vercel

### Étape 1 : Configurer Vercel


Connectez votre dépôt GitHub à Vercel. Pour ce faire :

	1.	Connectez-vous à Vercel.
	2.	Sélectionnez “New Project” et connectez le dépôt GitHub.
	3.	Configurez les variables d’environnement dans le tableau de bord Vercel.

### Étape 2 : Déployer

      Lors de chaque commit, Vercel déclenche automatiquement un déploiement. 
### Étape 3 : Configuration de la Base de Données

 base de données PostgreSQL est hébergée sur neon.tech, assurez-vous que l’URL de connexion dans .env de Vercel pointe vers la base de données de production.

## Contribution

Les contributions sont les bienvenues ! Pour toute demande de fonctionnalité, ouvrez une issue, et pour une correction de code, créez une pull request. Assurez-vous de suivre les bonnes pratiques de codage pour les conventions TypeScript et Prisma.

Licence

Ce projet est sous licence MIT.