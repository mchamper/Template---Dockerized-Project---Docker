#!/bin/bash

. .env || exit 1

SERVICE=$1

bash base/bin/docker/run.sh $SERVICE "eb status"
