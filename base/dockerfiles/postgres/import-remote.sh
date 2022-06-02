#!/bin/bash

. ../exports/.env || exit 1

FILE="../exports/dump.sql"

export PGPASSFILE=/home/root/exports/.pgpass
chmod 600 ${PGPASSFILE}

echo "Importing..."
psql --host=${HOST} --port=${PORT} --username ${POSTGRES_USER} ${POSTGRES_DB} < ${FILE}
echo "Import finished"
