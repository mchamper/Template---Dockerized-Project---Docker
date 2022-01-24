#!/bin/bash

. .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

SERVICE=backend-php

if [[ $CMD = "add-ip" ]]; then
  IP=$2
  DESCRIPTION=$3

  bash base/bin/aws/ec2-add-ip.sh $SERVICE "security-group-id" "$IP" "$DESCRIPTION"
  exit
fi
