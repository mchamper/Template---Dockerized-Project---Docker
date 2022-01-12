#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

SERVICE=$CMD
SECURITY_GROUP_ID=$ARG1
IP=$ARG2
DESCRIPTION=$ARG3
REGEX="^[0-9]+$"

if ! [[ $IP =~ $REGEX ]]; then
  DESCRIPTION=$IP
  IP="$(dig +short myip.opendns.com @resolver1.opendns.com)"
fi

bash base/bin/docker/run.sh $SERVICE "
  aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --ip-permissions IpProtocol=tcp,FromPort=3306,ToPort=3306,IpRanges=[{CidrIp=$IP/32,Description=\"$DESCRIPTION\"}]
"
