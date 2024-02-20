# build stage
FROM node:18.12.0-alpine as build-stage
LABEL authors="cassolseba"
WORKDIR /summit-finder
COPY package.json ./
RUN npm install
COPY .. .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /summit-finder/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]