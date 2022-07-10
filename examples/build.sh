#!/bin/bash

. .env || exit 1

bash base/bin/docker/build.sh ${1}
