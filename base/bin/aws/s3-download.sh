#!/bin/bash

. .env || exit 1

SERVICE=${1}
BUCKET=${2}
TARGET=${3}

bash base/bin/docker/run.sh 0-aws "
  cd /docker/src/${SERVICE} || exit 1
  aws s3 cp s3://${BUCKET} ${TARGET}/.aws.s3.${BUCKET} --recursive;
  chown -R 1000:1000 ${TARGET}/.aws.s3.${BUCKET};
"
