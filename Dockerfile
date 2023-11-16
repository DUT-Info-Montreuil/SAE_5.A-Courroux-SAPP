# Utiliser une image Node.js basée sur Alpine comme base
FROM node:21-alpine3.18

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le package.json et le package-lock.json dans le conteneur
COPY . .

# Installer les dépendances
RUN npm install

RUN npm install -g @angular/cli


# Commande pour démarrer l'application avec npm start au lancement du conteneur
CMD ["ng", "serve", "--host", "0.0.0.0"]