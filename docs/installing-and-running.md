### Prerequisites

## Install

```bash
$ yarn install
```

## Deploy with Docker

```bash
# creates and loads the docker container with required configuration. replace [api-key] with your open weather api key
$ export OPEN_WEATHER_API_KEY=[api-key] && docker-compose up -d
```

Run the following command to check if the container is running

```bash
$ curl get http://127.0.0.1:9000/cities
# should return: []
```

### Testing

```bash
# integration tests
$ docker exec -it api-service yarn test

# test coverage
$ docker exec -it api-service yarn test:cov
```

## Run the services in the development mode

```bash
# terminal #1
$ cd api-service
$ cp .env.example .env
$ yarn start:dev
```

```bash
# terminal #2
$ cd weather-service
$ cp .env.example .env # then replace the [api-key] with the open weather api key
$ yarn start:dev
```

```bash
# terminal #1
$ yarn test
```
