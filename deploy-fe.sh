#!/bin/bash

set -e 

docker build -t fismed-fe-staging:latest .

docker compose up -d