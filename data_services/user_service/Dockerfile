FROM node:18.12.0
LABEL authors="cassolseba"

WORKDIR /user_service
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]