# build stage
FROM node:18.12.0-alpine as build-stage
LABEL authors="cassolseba"
WORKDIR /summit-finder

ARG VUE_APP_TOUR_PORT
ENV VUE_APP_TOUR_PORT=$VUE_APP_TOUR_PORT
ARG VUE_APP_AUTHENTICATION
ENV VUE_APP_AUTHENTICATION=$VUE_APP_AUTHENTICATION
ARG VUE_APP_MANAGEMENT_PORT
ENV VUE_APP_MANAGEMENT_PORT=$VUE_APP_MANAGEMENT_PORT
ARG VUE_APP_GOOGLE_MAPS_KEY
ENV VUE_APP_GOOGLE_MAPS_KEY=$VUE_APP_GOOGLE_MAPS_KEY

COPY package.json ./
RUN npm install
COPY .. .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /summit-finder/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]