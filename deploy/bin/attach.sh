#!/bin/bash

docker-compose -f docker-compose.${1}.yml exec -u ${3:-root} ${2}-${1} /bin/sh
