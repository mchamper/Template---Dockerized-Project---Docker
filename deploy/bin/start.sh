#!/bin/bash

bash bin/src/switch.sh ${1}

docker-compose -f docker-compose.${1}.yml up -d ${2}
