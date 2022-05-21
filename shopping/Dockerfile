FROM node

WORKDIR /app/shopping

COPY package.json .

ENV NODE_ENV prod

RUN npm install

COPY . .

EXPOSE 8003

CMD ["node", "src/index.js"]