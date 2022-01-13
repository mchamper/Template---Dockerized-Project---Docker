#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env

SERVICE=$1
S3_BUCKET=$2
TARGET=$3

bash base/bin/docker/run.sh $SERVICE "
  aws s3 cp s3://$S3_BUCKET $TARGET/.aws.s3.$S3_BUCKET --recursive;
  chown -R 1000:1000 $TARGET/.aws.s3.$S3_BUCKET;
"
