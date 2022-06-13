VERSION := $(shell cat package.json | grep version | rev | cut -f 1 -d " " | rev | sed -e s:,::g | sed -e s:\"::g)

Nothing:
	@echo "No target provided. Stop"

.PHONY: docker-build-test
docker-build-test:
	docker build -t ga4gh/ga4gh-starter-kit-passport-ui-node:test .

.PHONY: docker-build
docker-build:
	docker build -t ga4gh/ga4gh-starter-kit-passport-ui-node:${VERSION} .

# Runs the passport network (Hydra + Kratos + our UI)
.PHONY: passport-network
passport-network: 
	docker-compose -f passport-network.yml up --build --force-recreate

# To run passport network in the develop mode run passport-develop-1 and passport-develop-2 in two separate terminals
# This way, changes made in the passport-ui-node can be viewed instantly  
.PHONY: passport-develop-1
passport-develop-1:
	npx tsc

	KRATOS_PUBLIC_URL=http://localhost:4433/ \
	KRATOS_BROWSER_URL=http://127.0.0.1:4433/ \
    PASSPORT_BROKER_PUBLIC_URL=http://localhost:4500/ga4gh/passport/v1/ \
    PASSPORT_BROKER_ADMIN_URL=http://localhost:4501/admin/ga4gh/passport/v1/ \
    PORT=4455 \
	SECURITY_MODE= \
	node lib/index.js

.PHONY: passport-develop-2
passport-develop-2:
	docker-compose -f passport-develop.yml up --build --force-recreate

############################

# Runs just the Ory Hydra Service
.PHONY: run-hydra
run-hydra: 
	docker-compose -f hydra-service.yml up --build --force-recreate

# Runs just the Ory Kratos Service
.PHONY: run-kratos
run-kratos:
	docker-compose -f kratos-service.yml up --build --force-recreate

############ RUNNING HYDRA TUTORIAL ################

COMPOSE_NAME ?= hydra-service.yml 

# Use passport-network.yml or passport-develop-yml if needed \
Pre-written examples for ease of use: \
make run-hydra-tutorial COMPOSE_NAME=passport-network.yml \
make run-hydra-tutorial COMPOSE_NAME=passport-develop-2.yml \

.PHONY: run-hydra-tutorial
run-hydra-tutorial:
	docker-compose -f ${COMPOSE_NAME} exec hydra \
    hydra clients create \
    --endpoint http://127.0.0.1:4445/ \
    --id my-client \
    --secret secret \
    --grant-types client_credentials

	docker-compose -f ${COMPOSE_NAME} exec hydra \
    hydra token client \
    --endpoint http://127.0.0.1:4444/ \
    --client-id my-client \
    --client-secret secret

	docker-compose -f ${COMPOSE_NAME} exec hydra \
    hydra clients create \
    --endpoint http://127.0.0.1:4445 \
    --id auth-code-client \
    --secret secret \
    --grant-types authorization_code,refresh_token \
    --response-types code,id_token \
    --scope openid,offline \
    --callbacks http://127.0.0.1:5555/callback

	docker-compose -f ${COMPOSE_NAME} exec hydra \
    hydra token user \
    --client-id auth-code-client \
    --client-secret secret \
    --endpoint http://127.0.0.1:4444/ \
    --port 5555 \
    --scope openid,offline

############################

.PHONY: docker-down
docker-down:
	docker-compose -f passport-network.yml down -v
	docker-compose -f passport-network.yml rm -fsv
	docker-compose -f kratos-service.yml down -v
	docker-compose -f kratos-service.yml rm -fsv
	docker-compose -f hydra-service.yml down -v
	docker-compose -f hydra-service.yml rm -fsv