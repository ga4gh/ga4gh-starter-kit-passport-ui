# create jar file
.PHONY: jar-build
jar-build:
	@./gradlew bootJar
	
# build docker image
.PHONY: docker-build # this doesn't work but docker build command does :)
docker-build:
	docker build -t ga4gh/ga4gh-starter-kit-passport-ui .

# not tested
.PHONY: docker-compose
docker-build: docker compose -f test-compose.yml up