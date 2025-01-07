#!/bin/bash

docker-compose -f docker-compose.${1}.yml down ${2}
