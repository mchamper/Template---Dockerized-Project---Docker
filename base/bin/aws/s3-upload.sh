#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env

SERVICE=$1
SOURCE=$2
S3_BUCKET=$3

bash base/bin/docker/run.sh $SERVICE "
  aws s3 cp $SOURCE s3://$S3_BUCKET --recursive --exclude \".git/*\";
"
