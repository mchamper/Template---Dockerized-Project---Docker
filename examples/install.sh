#!/bin/bash

. .env || exit 1

bash base/bin/sources/create.sh --all || exit 1
bash base/bin/docker/build.sh || exit 1

########################################

bash bin/core/web.sh clone
bash bin/core/mobile.sh clone
bash bin/core/backoffice.sh clone
bash bin/core/backend.sh clone
