#!/bin/bash

cd ../../docker && git restore . && git pull

cd ../webapp && git restore . && git pull
cd ../backoffice && git restore . && git pull
cd ../backend && git restore . && git pull
