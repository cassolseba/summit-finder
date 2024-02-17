FROM node:18.12.0-alpine
LABEL authors="cassolseba"

WORKDIR /openweather_adapter
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]