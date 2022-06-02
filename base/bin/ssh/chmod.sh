#!#!/bin/bash

. .env || exit 1

chmod -R 400 credentials/.ssh/*.pem;
chmod -R 400 credentials/.ssh/*.ppk;
