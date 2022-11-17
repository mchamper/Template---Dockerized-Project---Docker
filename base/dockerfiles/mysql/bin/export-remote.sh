#!/bin/bash

. /docker/exports/.env || exit 1

FILE="/docker/exports/dump.sql"

if [[ ! -f $FILE ]]; then
  mkdir -p "${FILE%/*}" && touch "$FILE"
fi

EXCLUDED_TABLES_STRING=""

for TABLE in "${EXCLUDED_TABLES[@]}"; do :
  EXCLUDED_TABLES_STRING+=" --ignore-table=${DATABASE}.${TABLE}"
done

echo "Exporting schema..."
mysqldump --verbose --quick \
  --host=${HOST} \
  --port=${PORT} \
  --user=${USER} \
  --password=${PASSWORD} \
  --no-data --routines \
  ${DATABASE} | sed -e 's/DEFINER[ ]*=[ ]*[^*]*\*/\*/' > ${FILE}

echo "Exporting data..."
mysqldump --verbose --quick \
  --host=${HOST} \
  --port=${PORT} \
  --user=${USER} \
  --password=${PASSWORD} \
  --no-create-info --skip-triggers ${EXCLUDED_TABLES_STRING} \
  ${DATABASE} >> ${FILE}

echo "Export finished"

chown 1000 ${FILE}
