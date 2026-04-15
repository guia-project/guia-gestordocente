# ETAPA 1: Construcción (Compilamos React/Vite)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ETAPA 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copiamos los archivos compilados de Vite (carpeta dist) al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Truco de Arquitecto: Configuramos Nginx para que funcione bien el enrutamiento de React (SPA)
RUN sed -i 's/try_files $uri $uri\/ =404;/try_files $uri $uri\/ \/index.html;/g' /etc/nginx/conf.d/default.conf
# Exponemos el puerto web por defecto
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]