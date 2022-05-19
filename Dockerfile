# FROM node:13.6-alpine (what was here before, using old Ory Kratos)
# FROM node:17.0-alpine (what they use in the default Ory Kratos repo)
FROM node:17.7.1-alpine3.14

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG LINK=no

COPY package.json package.json
COPY package-lock.json package-lock.json

# added -g flatten-packages
# now added --silent; exit 0
RUN npm ci --silent; exit 0

COPY . /usr/src/app

RUN if [ "$LINK" == "true" ]; then (cd ./contrib/sdk/generated; rm -rf node_modules; npm ci; npm run build); \
    cp -r ./contrib/sdk/generated/* node_modules/@oryd/kratos-client/; \
    fi

# removes library, and runs npx tsc (creates a new /lib/ folder)
RUN npm run build 

ENTRYPOINT npm run serve

EXPOSE 3000