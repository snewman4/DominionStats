FROM node:14
WORKDIR /app
COPY package.json /app
RUN yarn install && yarn build
COPY . /app
CMD yarn start
EXPOSE 3001