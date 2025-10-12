FROM node:20

WORKDIR /app

#RUN useradd --system --user-group appuser
RUN apt-get update && apt-get install -y libasound2 libasound2-dev gcc python3 alsa-utils

COPY dist app/
COPY package.json app/
#RUN chown -R appuser:appuser .

CMD [ "node", "app/main.js" ]