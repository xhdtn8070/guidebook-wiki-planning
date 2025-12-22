FROM node:lts-alpine

WORKDIR /app
COPY . .

ENV PORT=4173
EXPOSE 4173

CMD ["node", "prototype/dev-server.js"]
