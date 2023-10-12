# Étape 1 : Construire l'application Angular
FROM node:18.13.0 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Installez Angular CLI de manière globale
RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

# Étape 2 : Exécuter l'application dans un serveur HTTP léger
FROM nginx:alpine

# Copiez les fichiers de build de l'étape précédente dans le répertoire de travail de Nginx
COPY --from=build /app/dist/* /usr/share/nginx/html/

# Exposez le port 80 pour le serveur HTTP Nginx
EXPOSE 80
