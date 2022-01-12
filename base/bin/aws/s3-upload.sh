#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

SERVICE=$CMD
SOURCE=$ARG1
S3_BUCKET=$ARG2

bash base/bin/docker/run.sh $SERVICE "
  aws s3 cp $SOURCE s3://$S3_BUCKET --recursive --exclude \".git/*\";
"
