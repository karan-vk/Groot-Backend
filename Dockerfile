FROM node:alpine
WORKDIR /app

COPY package.json .
RUN npm install --production
COPY prisma .
RUN npx prisma generate

COPY . .

CMD [ "node", "index.js" ]