FROM node:lts AS development

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:lts as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /home/node/app/dist ./dist

CMD ["yarn", "start:prod" ,"dist/main"]