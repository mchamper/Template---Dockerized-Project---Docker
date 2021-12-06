#!/bin/bash

docker-compose \
    -f ../compose.dev.yml \
    up -d $1