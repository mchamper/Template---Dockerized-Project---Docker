#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env

SERVICE=$1

bash base/bin/docker/run.sh $SERVICE "eb printenv"
