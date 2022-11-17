ARG MYSQL_VERSION=latest
FROM mysql:${MYSQL_VERSION}

WORKDIR /docker/src
RUN chown -R mysql:mysql /docker
ENV PATH="/home/mysql/.local/bin:${PATH}"

##############################
##############################

COPY bin /docker/bin

USER mysql
