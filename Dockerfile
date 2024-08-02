# build environment
FROM node:alpine as build
ENV export NODE_OPTIONS=--max-old-space-size=42768
WORKDIR /app
COPY . .
EXPOSE 4000
RUN npm i
RUN npx prisma generate
RUN npm run build
CMD [ "node", "dist/main.js" ]