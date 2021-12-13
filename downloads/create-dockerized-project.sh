#!/bin/bash

git clone git@github.com:mchamper/Template---Dockerized-Project---Docker.git ./.tmp-dockerized-project || exit 1
bash ./.tmp-dockerized-project/base/commands/create-dockerized-project.sh
