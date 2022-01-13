#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env

SERVICE=$1

if [[ $2 != "" ]]; then
  bash base/bin/docker/run.sh $SERVICE "eb ssh -n 1 --command \"$2\""
else
  bash base/bin/docker/run.sh $SERVICE "eb ssh"
fi
