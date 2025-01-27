# Etapa 1: Build
FROM node:20-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY ./webapp/package.json package.json
COPY ./webapp/package-lock.json package-lock.json
RUN npm install && npm ci

# Copiar el resto del código de la aplicación
COPY ./webapp .

# Construir la aplicación Angular para producción
ARG BUILD_CMD
RUN npm run ${BUILD_CMD}

# Etapa 2: Servir la aplicación
FROM nginx:alpine

# Copiar el build de Angular a la carpeta de Nginx
COPY --from=build /app/dist/app /var/www/html

# Copiar configuración personalizada de Nginx
COPY ./docker/deploy/dockerfiles/webapp/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puertos de Nginx
EXPOSE 80 443

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
