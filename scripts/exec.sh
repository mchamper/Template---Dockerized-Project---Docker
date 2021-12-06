#!/bin/bash

docker-compose \
    -f ../compose.dev.yml \
    exec $1 \
    /bin/sh -c "$2"