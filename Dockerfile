FROM node:14
WORKDIR /app
COPY package.json /app
COPY . /app
RUN yarn install && yarn build
CMD yarn start
EXPOSE 3001