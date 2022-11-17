#!/bin/bash

. /docker/exports/.env || exit 1

FILE="/docker/exports/dump.sql"

echo "Importing..."
mysql \
  --host=${HOST} \
  --port=${PORT} \
  -u ${USER} \
  -p"${PASSWORD}" \
  ${DATABASE} < ${FILE}

echo "Import finished"
