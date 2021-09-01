FROM node:alpine
WORKDIR /app

COPY package.json .
RUN npm install --production
COPY prisma .
RUN npx prisma generate
ENV PORT=80
EXPOSE 80
EXPOSE 443
COPY . .

CMD [ "node", "index.js" ]