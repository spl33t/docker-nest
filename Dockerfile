FROM node:latest

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i

COPY . .

RUN npx prisma generate
RUN npx prisma db push --force-reset

CMD [ "npm", "run", "start:dev" ]