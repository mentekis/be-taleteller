FROM node:22 AS build

WORKDIR /apps/be-taleteller

COPY . .

RUN npm install

RUN npm run build

FROM node:22.6.0-alpine3.19

WORKDIR /apps/be-taleteller

COPY --from=build /apps/be-taleteller/dist ./dist

COPY ./.env ./.env

COPY package*.json .

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]