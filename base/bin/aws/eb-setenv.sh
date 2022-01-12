#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env
CMD=$1; ARG1=$2; ARG2=$3; ARG3=$4; ARG4=$5; ARG5=$6;

SERVICE=$CMD
ENVS=($(cat $ARG1))

for ENV in "${ENVS[@]}"; do :
  ENVS_STRING+=" $ENV"
done

if [[ $ARG2 = "--echo" ]]; then
  echo "eb setenv$ENVS_STRING"
else
  bash base/bin/docker/run.sh $SERVICE "eb setenv$ENVS_STRING"
fi

exit
