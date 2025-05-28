FROM node:lts-alpine

RUN addgroup -S appgroup && adduser -S bruno -G appgroup

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R bruno:appgroup /usr/src/app

USER bruno

EXPOSE 3000

CMD [ "npm", "start" ]