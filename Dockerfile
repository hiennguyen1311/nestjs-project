FROM node:lts

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package.json /home/node/app/

RUN chmod 777 -R /home/node/app

COPY package*.json ./

RUN yarn install

COPY . ./

EXPOSE 3300

RUN yarn build:prod

CMD ["yarn", "run", "start:dev"]
