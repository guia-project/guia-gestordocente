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

# Configuración Nginx para React SPA + proxy interno hacia el backend privado
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
