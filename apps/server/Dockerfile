FROM node:18-alpine

RUN apk add --no-cache libc6-compat python3 make g++
RUN apk update

WORKDIR /app
COPY . /app
RUN npm install && npm run build
EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]