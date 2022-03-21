Nothing:
	@echo "No target provided. Stop"
	
.PHONY: docker-build # this doesn't work but docker build command does :)
docker-build:
	docker build -t ga4gh/ga4gh-starter-kit-passport-ui .

# not tested
.PHONY: docker-compose
docker-compose: 
	docker-compose -f test-compose.yml \
    -f quickstart-postgres.yml \
    up --build

.PHONY: run-ory-tutorial
run-ory-tutorial:
	docker-compose -f test-compose.yml exec hydra \
    hydra clients create \
    --endpoint http://127.0.0.1:4445/ \
    --id my-client \
    --secret secret \
    --grant-types client_credentials

	docker-compose -f test-compose.yml exec hydra \
    hydra token client \
    --endpoint http://127.0.0.1:4444/ \
    --client-id my-client \
    --client-secret secret

	docker-compose -f test-compose.yml exec hydra \
    hydra clients create \
    --endpoint http://127.0.0.1:4445 \
    --id auth-code-client \
    --secret secret \
    --grant-types authorization_code,refresh_token \
    --response-types code,id_token \
    --scope openid,offline \
    --callbacks http://127.0.0.1:5555/callback

	docker-compose -f test-compose.yml exec hydra \
    hydra token user \
    --client-id auth-code-client \
    --client-secret secret \
    --endpoint http://127.0.0.1:4444/ \
    --port 5555 \
    --scope openid,offline

	open -a "Google Chrome" http://127.0.0.1:5555/

.PHONY: short-ory-tutorial
short-ory-tutorial:
	docker-compose -f test-compose.yml exec hydra \
    hydra token client \
    --endpoint http://127.0.0.1:4444/ \
    --client-id my-client \
    --client-secret secret

	docker-compose -f test-compose.yml exec hydra \
    hydra token user \
    --client-id auth-code-client \
    --client-secret secret \
    --endpoint http://127.0.0.1:4444/ \
    --port 5555 \
    --scope openid,offline

	open -a "Google Chrome" http://127.0.0.1:5555/