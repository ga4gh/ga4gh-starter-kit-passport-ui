# ga4gh-starter-kit-passport-ui
Central UI server connecting to other Passport-related microservices (ory hydra, ory kratos)

## Starting Guide
This service is a docker container, having [Docker Desktop](https://docs.docker.com/desktop/) installed beforehand will be useful. This repo \
uses a [Makefile](./Makefile), which allows defining special shell commands. If you would like to see what does the make commands do in more \ detail, please
visit the [makefile](./Makefile).

First build the `docker image` with the contents of this repo:
```
make docker-build
```
```
docker build -t ga4gh/ga4gh-starter-kit-passport-ui-node:test .
```





`inline code`


