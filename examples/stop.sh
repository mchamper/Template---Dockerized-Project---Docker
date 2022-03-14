#!/bin/bash

. .env || exit 1

if [[ ${MUTAGEN} = 1 ]]; then bash base/bin/mutagen/terminate.sh; fi
bash base/bin/docker/down.sh
