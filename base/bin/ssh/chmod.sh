#!#!/bin/bash

if [ ! -f .env ]; then cd ../../; fi; . .env

chmod -R 400 credentials/.ssh/*.pem;
