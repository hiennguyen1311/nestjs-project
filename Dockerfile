FROM node:lts

WORKDIR /home/node/app
RUN chmod 777 -R /home/node/app
COPY . ./
RUN yarn install
RUN yarn build:prod

CMD ["yarn", "start:dev", "dist/main.js"]