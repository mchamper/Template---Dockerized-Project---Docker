#!/bin/bash

docker-compose -f docker-compose.${1}.yml logs ${2}-${1}
