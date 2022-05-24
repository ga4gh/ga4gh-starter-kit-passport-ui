# ga4gh-starter-kit-passport-ui
Central UI server connecting to other Passport-related microservices (ory hydra, ory kratos)

## Starting Guide
This service is a docker container, having [Docker Desktop](https://docs.docker.com/desktop/) installed beforehand will be useful. This repo uses a [Makefile](./Makefile), which allows defining special shell commands. If you would like to see what does the make commands do in more detail, please visit the file.

***
###### Building the Docker Image
First build the `docker image` with the contents of this repo:
```
make docker-build
```

Confirm the `docker image` is present by running;
```
docker images
```
You should see an image for the repository `ga4gh/ga4gh-starter-kit-passport-ui-node` with the tag `latest`

***
###### Running the Docker Compose
The GA4GH Passports: [Starterkit]("https://starterkit.ga4gh.org/") Implementation is made up of multiple services, this UI-node being one of them. In order to start running multiple services at once a [docker compose](./passport-develop.yml) file used.

Spin up the docker compose file by running:
```
make passport-network
```

Note: If you would like to modify the ui-node locally, you can also run two commands in two separate terminal tabs...

For the UI-node:
```
make passport-develop-1
```

For all other services:
```
make passport-develop-2
```

***
###### Confirm Docker Compose is Working
First wait for all the downloading that is needed for the other docker images. You will know the services have succesfully started if the
migration services succesfully exit.

You can confirm this by confirming the lines (not necessarily one after the other)
```
ga4gh-starter-kit-passport-ui_kratos-migrate_1 exited with code 0
ga4gh-starter-kit-passport-ui_hydra-migrate_1 exited with code 0
```

You can also confirm by opening the currently active docker compose in the Docker Desktop app, you should see the two migration services
grayed out. The services are named `ga4gh-starter-kit-passport-ui_kratos-migrate_1` and `ga4gh-starter-kit-passport-ui_hydra-migrate_1`.

###### The Passport Broker
One crucial service is the passport broker, which is a docker container as well. It is named `ga4gh-starter-kit-passport-ui_passport-broker_1`.
The best way to confirm if the service is working by sending it some general API requests from your favorite API platform (such as [Postman](https://www.postman.com/)).

Confirm the service is working by sending a GET request to the `http://localhost:4500/ga4gh/passport/v1/service-info` endpoint. You should get
back an object body starting with `id` with value `"org.ga4gh.starterkit.passport.broker"`, and other information.

Keep your API platform handy, since we will be sending other requests to the Passport Broker.


