FROM node:8-alpine
WORKDIR /app
COPY package.json .
RUN yarn install --ignore-engines
COPY . .
CMD ["yarn", "install"]