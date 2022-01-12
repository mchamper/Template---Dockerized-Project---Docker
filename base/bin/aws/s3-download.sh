#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

SERVICE=$CMD
S3_BUCKET=$ARG1
TARGET=$ARG2

bash base/bin/docker/run.sh $SERVICE "
  aws s3 cp s3://$S3_BUCKET $TARGET/.aws.s3.$S3_BUCKET --recursive;
  chown -R 1000:1000 $TARGET/.aws.s3.$S3_BUCKET;
"
