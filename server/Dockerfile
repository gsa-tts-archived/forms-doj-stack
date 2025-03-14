FROM node:22-bookworm

LABEL org.opencontainers.image.description DOJ Forms Platform

RUN apt update && \
  apt install -y git
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
#RUN npm ci
COPY . .
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD [ "node", "./dist/index.js" ]

#HEALTHCHECK --interval=5m --timeout=3s \
#  CMD curl -f http://localhost:4321/ || exit 1
