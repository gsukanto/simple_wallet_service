FROM node:14-alpine

EXPOSE 3000 3000

COPY . /home/app
WORKDIR /home/app
RUN npm install
RUN npm run build-ts

CMD npm start
