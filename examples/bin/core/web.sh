#!/bin/bash

. .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

SERVICE=web

if [[ $CMD = "-v" ]]; then
  if [[ $ARG1 != "" ]]; then
    bash base/bin/git/release.sh $SERVICE "$ARG1"; else
    bash base/bin/git/version.sh $SERVICE; fi

  exit
fi

if [[ $CMD = "clone" ]]; then
  bash base/bin/git/clone.sh $SERVICE "git@github.com:project-name/project-name.git" develop --flow || exit 1
  exit
fi

##############################

if [[ $CMD = "upload" ]]; then
  bash base/bin/aws/s3-upload.sh $SERVICE "dist" "bucket-name" --delete
  bash base/bin/aws/cloudfront-invalidate.sh $SERVICE "distribution-id"

  exit
fi

if [[ $CMD = "download" ]]; then
  bash base/bin/aws/s3-download.sh $SERVICE "bucket-name" "dist"
  exit
fi

if [[ $CMD = "deploy" ]]; then
  bash $0 upload
  exit
fi
