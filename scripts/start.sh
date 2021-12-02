#!/bin/bash

docker-compose \
    -f ../compose.dev.yml \
    up $1 -d