#!/bin/bash

. .env || exit 1

bash base/bin/docker/down.sh ${1}
