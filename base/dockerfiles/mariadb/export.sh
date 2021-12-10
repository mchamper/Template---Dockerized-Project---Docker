#!/bin/bash

. .env || exit 1

FILE="dumps/dump.sql"
EXCLUDED_TABLES_STRING=""

for TABLE in "${EXCLUDED_TABLES[@]}"; do :
  EXCLUDED_TABLES_STRING+=" --ignore-table=${DATABASE}.${TABLE}"
done

echo "Exporting schema..."
mysqldump --verbose --quick --host=${HOST} --port=${PORT} --user=${USER} --password=${PASSWORD} --no-data --routines ${DATABASE} | sed -e 's/DEFINER[ ]*=[ ]*[^*]*\*/\*/' > ${FILE}

echo "Exporting data..."
mysqldump --verbose --quick --host=${HOST} --port=${PORT} --user=${USER} --password=${PASSWORD} ${DATABASE} --no-create-info --skip-triggers ${EXCLUDED_TABLES_STRING} >> ${FILE}

echo "Export finished"
