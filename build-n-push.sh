#!/bin/bash

set -e

git pull

sleep 5

git checkout main

sleep 5

docker buildx build --platform linux/amd64 -t boyangyang/fismed-fe:latest .

sleep 5

docker push boyangyang/fismed-fe:latest
