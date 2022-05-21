FROM node

WORKDIR /app/products

COPY package.json .

ENV NODE_ENV prod

RUN npm install

COPY . .

EXPOSE 8002

CMD ["node", "src/index.js"]