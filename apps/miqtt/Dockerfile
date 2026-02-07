FROM arm32v7/node:20-alpine

#RUN useradd --system --user-group appuser
RUN apk add --no-cache libasound alsa-lib-dev gcc g++ make python3

COPY . app/

WORKDIR /app

RUN yarn install --frozen-lockfile
RUN ls -la && pwd
RUN npx nx build miqtt


CMD [ "node", "apps/miqtt/dist/main.js" ]