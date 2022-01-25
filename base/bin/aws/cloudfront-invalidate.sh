#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env

SERVICE=$1
DISTRIBUTION_ID=$2

bash base/bin/docker/run.sh $SERVICE "
  aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths \"/*\"
"
