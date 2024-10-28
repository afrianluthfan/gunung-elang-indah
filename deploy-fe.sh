#!/bin/bash

set -e 

docker build -t fismed-fe:latest .

docker compose up -d