#!/bin/bash

. ../exports/.env || exit 1

FILE="../exports/dump.sql"

if [[ ! -f $FILE ]]; then
  mkdir -p "${FILE%/*}" && touch "$FILE"
fi

EXCLUDED_TABLES_STRING=""

for TABLE in "${EXCLUDED_TABLES[@]}"; do :
  EXCLUDED_TABLES_STRING+=" --exclude-schema=${DATABASE}.${TABLE}"
done

export PGPASSFILE=/home/root/exports/.pgpass
chmod 600 ${PGPASSFILE}

echo "Exporting schema..."
pg_dump --verbose --host=${HOST} --port=${PORT} --username ${USER} ${DATABASE} --schema-only --clean > ${FILE}

echo "Exporting data..."
pg_dump --verbose --host=${HOST} --port=${PORT} --username ${USER} ${DATABASE} --data-only ${EXCLUDED_TABLES_STRING} >> ${FILE}

echo "Export finished"

chown 1000 ${FILE}
