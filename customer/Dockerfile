FROM node

WORKDIR /app/customer

COPY package.json .

ENV NODE_ENV prod

RUN npm install

COPY . .

EXPOSE 8001

CMD ["node", "src/index.js"]