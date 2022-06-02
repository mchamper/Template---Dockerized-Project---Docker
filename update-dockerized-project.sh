#!/bin/bash

git clone git@github.com:mchamper/Template---Dockerized-Project---Docker.git ./.tmp-dockerized-project || exit 1
bash ./.tmp-dockerized-project/base/bin/create-dockerized-project.sh ./ --root

if [[ ${1} == "--commit" ]]; then
  git add .
  git commit -m "Auto commit: Dockerized project updated"
  git push
fi
