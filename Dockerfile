FROM node:22 AS build

WORKDIR /apps/be-taleteller

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]