# build environment
FROM node:alpine as build
ENV export NODE_OPTIONS=--max-old-space-size=42768
WORKDIR /app
COPY . .
EXPOSE 8000
RUN npm i
RUN npx prisma generate
RUN npx prisma db push --force-reset
RUN npm run build