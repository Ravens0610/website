FROM node:10

ENV NEROVI_DATA_PATH=/opt/nerovi-data

RUN mkdir ${NEROVI_DATA_PATH} /usr/src -p
WORKDIR /usr/src
ADD . /usr/src
RUN npm install
RUN npm run build
ENV HOST 0.0.0.0
