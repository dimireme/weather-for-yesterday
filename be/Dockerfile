FROM node:20-alpine
WORKDIR /app
COPY be/package*.json ./
RUN yarn install --production
COPY be/ .
CMD ["node", "server.js"]
