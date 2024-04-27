# build
FROM node:18 as build

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY ./package.json ./pnpm-lock.yaml /usr/src/app

RUN pnpm i

COPY ./ ./

ENV SERVER_MATCH_REGEX="<SERVER_MATCH_REGEX>"
ENV MESSAGE_LIST="<MESSAGE_LIST>"
ENV HTML_TITLE="<HTML_TITLE>"
ENV SERVER_MATCH_REALM="<SERVER_MATCH_REALM>"

RUN pnpm build

# run
FROM node:18-alpine

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY ./docker /usr/src/app

EXPOSE 80

CMD ["node", "server.js"]
