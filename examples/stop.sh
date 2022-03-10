#!/bin/bash

. .env || exit 1

bash base/bin/mutagen/terminate.sh
bash base/bin/docker/down.sh
