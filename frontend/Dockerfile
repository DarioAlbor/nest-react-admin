# Stage 1: Build
FROM node:16.20.2-alpine AS build

WORKDIR /app

COPY . .

RUN yarn
RUN DISABLE_ESLINT_PLUGIN=true yarn build

# Stage 2: Production
FROM nginx:alpine

COPY --from=build /app/build/ /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
