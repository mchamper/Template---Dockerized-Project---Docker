#!/bin/bash

. .env || exit 1

SERVICE=${1}
SOURCE_FILE=${2}
BUCKET_FILE=${3}

bash base/bin/docker/run.sh ${SERVICE} "
  aws s3 cp ${SOURCE_FILE} s3://${BUCKET_FILE};
"
