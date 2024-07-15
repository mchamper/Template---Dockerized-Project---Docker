#!/bin/bash

. .env || exit 1

SERVICE=${1}
SOURCE=${2}
BUCKET=${3}
AWS_CMD="sync"

if [[ ${4} = "--delete" ]]; then
  AWS_CMD="sync --delete"
fi

bash base/bin/docker/run.sh 0-aws "
  cd /docker/src/${SERVICE} || exit 1
  aws s3 ${AWS_CMD} ${SOURCE} s3://${BUCKET} --exclude \".git/*\" --exclude \".aws.s3.*\";
"
