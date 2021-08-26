FROM node:alpine
WORKDIR /app

COPY package.json .
RUN npm install --production
RUN npx prisma generate

COPY . .

CMD [ "node", "index.js" ]