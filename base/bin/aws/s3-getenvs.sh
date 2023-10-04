#!/bin/bash

. .env || exit 1

SERVICE=${1}
BUCKET_FILE=${2}
SOURCE_FILE=${3}

echo $SERVICE
echo $BUCKET_FILE
echo $SOURCE_FILE

bash base/bin/docker/run.sh ${SERVICE} "
  aws s3 cp s3://${BUCKET_FILE} ${SOURCE_FILE};
"
