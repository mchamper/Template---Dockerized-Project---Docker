#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env

SERVICE=$1
SOURCE=$2
S3_BUCKET=$3
AWS_CMD="sync"

if [[ $4 = "--delete" ]]; then
  AWS_CMD="sync --delete"
fi

bash base/bin/docker/run.sh $SERVICE "
  aws s3 $AWS_CMD $SOURCE s3://$S3_BUCKET --exclude \".git/*\" --exclude \".aws.s3.*\";
"
