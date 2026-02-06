FROM node:20-bookworm

#RUN useradd --system --user-group appuser
RUN apt-get update && apt-get install -y libasound2 libasound2-dev gcc python3 alsa-utils

COPY . app/

WORKDIR /app

RUN yarn install --frozen-lockfile
RUN ls -la && pwd
RUN npx nx build miqtt


CMD [ "node", "apps/miqtt/dist/main.js" ]