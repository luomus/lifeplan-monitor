FROM node:15-alpine

WORKDIR /srv/app/lifeplan-monitor

WORKDIR /srv/app/lifeplan-monitor/frontend
COPY ./frontend/package*.json ./
RUN npm install --silent --only=prod

WORKDIR /srv/app/lifeplan-monitor/backend
COPY ./backend/package*.json ./
RUN ls
RUN npm install --silent --only=prod

WORKDIR /srv/app/lifeplan-monitor
COPY . .

WORKDIR /srv/app/lifeplan-monitor/backend
RUN npm run tsc
RUN npm run build:ui
RUN rm -rf ../frontend

RUN chgrp -R 0 /srv/app/lifeplan-monitor && chmod -R g+rwX /srv/app/lifeplan-monitor

EXPOSE 8081

USER 1000

CMD ["npm", "run", "start"]


