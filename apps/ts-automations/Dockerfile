FROM docker.io/node:24-alpine3.22

WORKDIR /app

RUN addgroup --system appuser && \
adduser --system -G appuser appuser

COPY dist app/
COPY package.json app/
RUN chown -R appuser:appuser .

CMD [ "node", "app/main.js" ]