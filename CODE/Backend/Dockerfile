FROM node:20.11.0-alpine3.19

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/

RUN npm run build

ENV PORT=3000

EXPOSE 3000

CMD ["npm","run","dev"]





