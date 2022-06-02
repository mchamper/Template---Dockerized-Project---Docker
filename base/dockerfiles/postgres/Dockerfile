ARG POSTGRES_VERSION=latest
FROM postgres:${POSTGRES_VERSION}-alpine

COPY export.sh /home/root/bin/export.sh
COPY export-remote.sh /home/root/bin/export-remote.sh
COPY import.sh /home/root/bin/import.sh
COPY import-remote.sh /home/root/bin/import-remote.sh
