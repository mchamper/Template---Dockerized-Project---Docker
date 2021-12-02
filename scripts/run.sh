#!/bin/bash

docker-compose \
    -f ../compose.dev.yml \
    run --rm $1 \
    /bin/sh -c "$2"