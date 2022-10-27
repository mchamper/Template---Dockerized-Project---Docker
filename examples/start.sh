#!/bin/bash

. .env || exit 1

bash base/bin/docker/start.sh "${1}"

# bash base/bin/docker/exec-d.sh web-dist-ssr ". /root/.bashrc && PORT=3000 node dist/app/server/main.js"
