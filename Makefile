Nothing:
	@echo "No target provided. Stop"

.PHONY: docker-build
docker-build:
	docker build -t ga4gh/ga4gh-starter-kit-passport-ui-node .

# Runs the passport network (Hydra + Kratos + our UI)
.PHONY: passport-network
passport-network: 
	docker-compose -f passport-network.yml up --build --force-recreate

############################

.PHONY: docker-build-hydra
docker-build-hydra:
	docker build -t ga4gh/ga4gh-starter-kit-passport-ui-hydra -f Dockerfile-Hydra .

.PHONY: docker-build-all
docker-build-all:
	make docker-build-hydra
	make docker-build

# Runs just the Ory Hydra Service
.PHONY: run-hydra
run-hydra: 
	docker-compose -f hydra-quickstart.yml \
	-f hydra-quickstart-postgres.yml \
	up --build

# Runs just the Ory Kratos Service
.PHONY: run-kratos
run-kratos:
	docker-compose -f kratos-quickstart.yml -f kratos-quickstart-standalone.yml up \
	--build --force-recreate

.PHONY: run-hydra-tutorial
run-ory-tutorial:
	docker-compose -f hydra-quickstart.yml exec hydra \
    hydra clients create \
    --endpoint http://127.0.0.1:4445/ \
    --id my-client \
    --secret secret \
    --grant-types client_credentials

	docker-compose -f hydra-quickstart.yml exec hydra \
    hydra token client \
    --endpoint http://127.0.0.1:4444/ \
    --client-id my-client \
    --client-secret secret

	docker-compose -f hydra-quickstart.yml exec hydra \
    hydra clients create \
    --endpoint http://127.0.0.1:4445 \
    --id auth-code-client \
    --secret secret \
    --grant-types authorization_code,refresh_token \
    --response-types code,id_token \
    --scope openid,offline \
    --callbacks http://127.0.0.1:5555/callback

	docker-compose -f hydra-quickstart.yml exec hydra \
    hydra token user \
    --client-id auth-code-client \
    --client-secret secret \
    --endpoint http://127.0.0.1:4444/ \
    --port 5555 \
    --scope openid,offline

.PHONY: run-short-hydra-tutorial
short-ory-tutorial:
	docker-compose -f hydra-quickstart.yml exec hydra \
    hydra token client \
    --endpoint http://127.0.0.1:4444/ \
    --client-id my-client \
    --client-secret secret

	docker-compose -f hydra-quickstart.yml exec hydra \
    hydra token user \
    --client-id auth-code-client \
    --client-secret secret \
    --endpoint http://127.0.0.1:4444/ \
    --port 5555 \
    --scope openid,offline

.PHONY: run-hydra-tutorial-passport
run-hydra-tutorial-passport:
	docker-compose -f passport-network.yml exec hydra \
	hydra clients create \
	--endpoint http://127.0.0.1:4445/ \
	--id my-client \
	--secret secret \
	--grant-types client_credentials

	docker-compose -f passport-network.yml exec hydra \
	hydra token client \
	--endpoint http://127.0.0.1:4444/ \
	--client-id my-client \
	--client-secret secret

	docker-compose -f passport-network.yml exec hydra \
	hydra clients create \
	--endpoint http://127.0.0.1:4445 \
	--id auth-code-client \
	--secret secret \
	--grant-types authorization_code,refresh_token \
	--response-types code,id_token \
	--scope openid,offline \
	--callbacks http://127.0.0.1:5555/callback

	docker-compose -f passport-network.yml exec hydra \
	hydra token user \
	--client-id auth-code-client \
	--client-secret secret \
	--endpoint http://127.0.0.1:4444/ \
	--port 5555 \
	--scope openid,offline

.PHONY: docker-down
docker-down:
	docker-compose -f passport-network.yml down -v
	docker-compose -f passport-network.yml rm -fsv
	docker-compose -f kratos-quickstart.yml down -v
	docker-compose -f kratos-quickstart.yml rm -fsv