FROM node:10-slim

LABEL "com.github.actions.name"="Commit message validation"
LABEL "com.github.actions.description"="Validates commit message and sets status accordingly."
LABEL "com.github.actions.icon"="gear"
LABEL "com.github.actions.color"="red"

LABEL "repository"="http://github.com/harmenjanssen/commit-message-validation-action"
LABEL "homepage"="http://github.com/harmenjanssen/commit-message-validation-action"
LABEL "maintainer"="Harmen Janssen <harmen@whatstyle.net>"

ADD package.json /package.json
#ADD package-lock.json /package-lock.json
WORKDIR /
COPY . /

RUN npm ci

ENTRYPOINT ["node", "/index.js"]
