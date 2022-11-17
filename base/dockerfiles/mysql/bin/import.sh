#!/bin/bash

FILE="/docker/exports/dump.sql"

echo "Importing..."
mysql \
  -u ${MYSQL_USER} \
  -p"${MYSQL_PASSWORD}" \
  ${MYSQL_DATABASE} < ${FILE}

echo "Import finished"
