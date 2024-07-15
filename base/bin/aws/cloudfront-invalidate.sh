#!/bin/bash

. .env || exit 1

SERVICE=${1}
DISTRIBUTION_ID=${2}

bash base/bin/docker/run.sh 0-aws "
  aws cloudfront create-invalidation \
    --distribution-id ${DISTRIBUTION_ID} \
    --paths \"/*\"
"
