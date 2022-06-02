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

echo "Exporting schema..."
pg_dump --verbose --username ${POSTGRES_USER} ${POSTGRES_DB} --schema-only --clean > ${FILE}

echo "Exporting data..."
pg_dump --verbose --username ${POSTGRES_USER} ${POSTGRES_DB} --data-only ${EXCLUDED_TABLES_STRING} >> ${FILE}

echo "Export finished"

chown 1000 ${FILE}
