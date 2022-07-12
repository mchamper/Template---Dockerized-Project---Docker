#!/bin/bash

. .env || exit 1

bash base/bin/docker/start.sh ${1}
