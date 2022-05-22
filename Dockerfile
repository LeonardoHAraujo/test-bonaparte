FROM node:14

WORKDIR /usr/src/app

COPY . ./

RUN yarn

EXPOSE 3333

RUN yarn build

CMD ["node", "dist/server.js"]
