#!/bin/bash

git clone git@github.com:mchamper/Template---Dockerized-Project---Docker.git ./tmp-dockerized-project || exit 0
rm -rf ./tmp-dockerized-project/.git
cp -rf ./tmp-dockerized-project "$1"
rm -rf ./tmp-dockerized-project
