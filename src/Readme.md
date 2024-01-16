# Stop me well

## Description

Ce projet contient la partie front-end du projet Stop Me Well.
En tant que développeur back-end, vous devez développer :
- l'API Restful
- la documentation
- le web socket

## Le projet front

### Installation

Après avoir cloné le projet, vous devez installer les dépendances avec la commande suivante :

```bash
npm install
```

Puis lancer le projet avec la commande suivante :

```bash
npm run dev
```

### Comment ça marche ?

Dans le fichier `src/main.ts`, vous aurez plusieurs parties :
- La connexion au web socket
- Une fonction showConnection qui permet d'afficher une interface pour se connecter et se créer un compte. C'est la page par défaut (fonction appellée tout en bas du fichier)
- Une fonction showHome qui permet de récupérer les données d'historique, de les afficher et de débuter une partie.
- Une fonction showGame qui permet de jouer au jeu après appui sur le bouton "Jouer" de la page Home.
- Une fonction checkConnexion qui permet de vérifier si l'utilisateur est connecté. Elle est appellée à chaque changement de "page".

### ATTENTION !!!

Vous n'avez pas à modifer le code de ce projet, il est juste là pour vous permettre de tester votre API et votre web socket.  
Si certaines choses ne vous conviennent pas, cela vient sûrement d'une contrainte imposée par le relou / formateur.  
Adaptez votre code côté serveur, en fonction de ce qui est demandé.

## Le projet back-end

### Setup (2 points)

Vous devez créer un nouveau projet de back-end.  
Vous êtes libre sur les choix techniques.  
Mais vous devez utiliser du json pour l'échange de données.  
Mettre en place les cors pour l'API Restful.  
Stcker les données dans une base de données (Mongo / Sqlite / MariaDB / Postgres / ...).  
Et l'API doit se lance sur le bon port.

### L'API Restful (14 points)

#### L'authenticaton (8 points)

Aidez vous le l'interface de connexion et création de compte et du code dans le fichier `src/main.ts` pour comprendre comment fonctionne l'authentification.
L'authentification se fait avec un token JWT.
Le token est stocké dans le local storage du navigateur. Vous n'avez pas à le gérer.
Une requête est effectuée à chaque changement de "page". La route de vérification du token doit également être implémentée !
Le token est également envoyé dans le header de la requête de récupération de données d'historique (page Home).

Vous devez donc implémenter :
- création de compte
- connexion
- vérification du token
- récupération des données d'historique

#### La ressource "Game" / "Jeux" (4 points)

Même si elles ne sont pas toutes utilisées dans le front, vous devez mettre en place toutes les routes "CRUD"
de la ressource des "Game" / "Jeux".
Respecter les conventions RESTful.

#### La documentation (2 points)

Pour documenter votre API Restful, vous devez utiliser un fichier se terminant par `.http`.  
Utiliser l'extension VSCode `REST Client` pour pouvoir tester vos routes directement dans VSCode.  
Si vous préférer utiliser Postman, vous pouvez exporter votre collection Postman.

### Le web socket (4 points)

Une partie débute quand deux joueurs sont sur la page du jeu.  
Le jeu consiste à fournir aux joueurs un temps cibles en début de partie (Temps aléatoire entre 5 et 10 secondes, défini aléatoirement par le back-end).  
Le joueur doit cliquer sur le bouton d'arrêt quand le temps cible lui semble être atteint.  
Dans ce cas son temps est enregistré côté server.

Quand tous les joueurs ont joué, le serveur envoie un message à tous les joueurs pour leur indiquer le socket id du gagnant de la manche et le temps de ce joueur.  

On stockera les informations en BDD :
- socket id des deux joueurs
- socket id du gagnant
- temps du gagnant
- temps cible

NB: 
On stockera les informations des sockets, pas des utilisateurs !  
Pas besoin de savoir qui a joué. Il faut simplement être connecté pour pouvoir jouer.  
L'utilisateur a même le droit de jouer contre lui même s'il se connecte deux fois sur deux navigateurs ou onglets différents.  
Une seule partie doit être jouable, on ne s'attend pas obligatoirement à ce que le back permette de rejouer une nouvelle partie.  
Pour l'évaluation, le serveur sera relancé avant de jouer une partie.