#!/bin/bash

. .env || exit 1

TARGET=${1}

# sudo apt install -y putty
puttygen credentials/.ssh/${TARGET}.ppk -O private-openssh -o credentials/.ssh/${TARGET}.openssh.ppk
