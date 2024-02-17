FROM node:18.12.0-alpine
LABEL authors="cassolseba"

WORKDIR /authentication_service
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]