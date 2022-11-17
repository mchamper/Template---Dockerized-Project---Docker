#!/bin/bash

. /docker/exports/.env || exit 1

FILE="/docker/exports/dump.sql"

if [[ ! -f $FILE ]]; then
  mkdir -p "${FILE%/*}" && touch "$FILE"
fi

EXCLUDED_TABLES_STRING=""

for TABLE in "${EXCLUDED_TABLES[@]}"; do :
  EXCLUDED_TABLES_STRING+=" --exclude-schema=${DATABASE}.${TABLE}"
done

export PGPASSFILE=/docker/exports/.pgpass
chmod 600 ${PGPASSFILE}

echo "Exporting schema..."
pg_dump --verbose \
  --host=${HOST} \
  --port=${PORT} \
  --username ${USER} \
  --schema-only --clean \
  ${DATABASE} > ${FILE}

echo "Exporting data..."
pg_dump --verbose \
  --host=${HOST} \
  --port=${PORT} \
  --username ${USER} \
  --data-only ${EXCLUDED_TABLES_STRING} \
  ${DATABASE} >> ${FILE}

echo "Export finished"

chown 1000 ${FILE}
