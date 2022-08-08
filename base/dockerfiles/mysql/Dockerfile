ARG MYSQL_VERSION=latest
FROM mysql:${MYSQL_VERSION}

RUN apt update && apt install --no-cache \
  git \
  zip \
  unzip \
  openssh-client \
  putty

COPY --chown=mysql export.sh /home/mysql/bin/export.sh
COPY --chown=mysql export-remote.sh /home/mysql/bin/export-remote.sh
COPY --chown=mysql import.sh /home/mysql/bin/import.sh
COPY --chown=mysql import-remote.sh /home/mysql/bin/import-remote.sh
