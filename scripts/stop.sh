#!/bin/bash

docker-compose \
    -f ../compose.dev.yml \
    stop $1