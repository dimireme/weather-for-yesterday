FROM node:20-alpine as builder
WORKDIR /app
COPY fe/package*.json ./
RUN yarn install
COPY fe/ .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/weather-for-yesterday
frontend