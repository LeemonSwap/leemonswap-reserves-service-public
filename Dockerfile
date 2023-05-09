FROM node:16.19-slim

WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y git
RUN yarn install
RUN yarn run build-enforced
EXPOSE 4000
CMD ["node", "./dist/index.js"]