#!/bin/bash

. .env || exit 1

SERVICE=${1}
SECURITY_GROUP_ID=${2}
IP=${3}
DESCRIPTION=${4}
PORT=${5}
REGEX="^[0-9]+"

if ! [[ ${IP} =~ ${REGEX} ]]; then
  IP="$(curl https://ipinfo.io/ip)"
fi

bash base/bin/docker/run.sh ${SERVICE} "
  aws ec2 authorize-security-group-ingress \
    --group-id ${SECURITY_GROUP_ID} \
    --ip-permissions IpProtocol=tcp,FromPort=${PORT},ToPort=${PORT},IpRanges=[{CidrIp=${IP}/32,Description=\"${DESCRIPTION}\"}]
"
