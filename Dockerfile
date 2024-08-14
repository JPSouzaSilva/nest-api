FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENTRYPOINT [ "npm", "run", "start:dev" ]