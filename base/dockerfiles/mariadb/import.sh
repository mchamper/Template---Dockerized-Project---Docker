#!/bin/bash

echo "Importing..."
mysql -u ${MYSQL_USER} -p"${MYSQL_PASSWORD}" ${MYSQL_DATABASE} < dumps/dump.sql
echo "Import finished"
