#!/bin/bash

FILE="../exports/dump.sql"

echo "Importing..."
psql --username ${POSTGRES_USER} ${POSTGRES_DB} < ${FILE}
echo "Import finished"
