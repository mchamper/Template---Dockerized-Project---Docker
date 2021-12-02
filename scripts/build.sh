#!/bin/bash

docker-compose \
    -f ../compose.dev.yml \
    build $1