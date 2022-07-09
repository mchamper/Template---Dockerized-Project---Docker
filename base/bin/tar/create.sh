#!/bin/bash

. .env || exit 1

TARGET=${1}
FOLDER_NAME=$(basename "${TARGET}")

cd "${TARGET}/.." && tar -zcf "${FOLDER_NAME}.tar.gz" "${FOLDER_NAME}"
