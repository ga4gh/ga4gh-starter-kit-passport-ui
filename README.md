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
The GA4GH Passports: [Starterkit]("https://starterkit.ga4gh.org/") Implementation is made up of multiple services, this ui-node being one of them. In order to start running multiple services at once a [docker compose](./passport-develop.yml) file used.

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


`inline code`


