#!/bin/bash

set -e

docker pull boyangyang/fismed-fe-staging:latest

# Stop and remove the fismed-be-dev container if it exists
if [ "$(docker ps -q -f name=fismed-fe-staging)" ]; then
#    docker stop fismed-be-dev
#    docker rm fismed-be-dev
     docker compose down -v
fi

# Tag the pulled image as fismed-be:latest
docker tag boyangyang/fismed-fe-staging:latest fismed-fe-staging:latest

sleep 1

docker compose up -d
