ARG BASE_IMAGE=node:20-alpine
FROM ${BASE_IMAGE}

#RUN useradd --system --user-group appuser
RUN apk add --no-cache alsa-lib alsa-lib-dev build-base python3

COPY . app/

WORKDIR /app

RUN yarn install --frozen-lockfile
RUN ls -la && pwd
RUN npx nx build miqtt


CMD [ "node", "apps/miqtt/dist/main.js" ]