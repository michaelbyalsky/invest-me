FROM node:14-slim as builder

WORKDIR /client

COPY ./client/package.json .

RUN npm install --only=production

COPY ./client .

RUN npm run build 

FROM node:alpine

WORKDIR /app

COPY ./server/package.json .

RUN npm install --only=production

COPY ./server .

COPY --from=builder ./client/build ./build

EXPOSE 5001

# ENV DOCKERIZE_VERSION v0.6.0

# RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz
# CMD ["dockerize" ,"-wait" ,"tcp://db:3306", "-timeout", "60m" "npm", "run", "dev" ]
CMD ["npm", "run", "start" ]