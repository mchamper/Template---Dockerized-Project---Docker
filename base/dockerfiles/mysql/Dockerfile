ARG MYSQL_VERSION=latest
FROM mysql:${MYSQL_VERSION}

WORKDIR /docker
COPY bin /docker/bin
RUN addgroup docker && adduser docker --uid 1000 --gid 1000
RUN chown -R docker:docker /docker
ENV PATH="/home/docker/.local/bin:${PATH}"

##############################
##############################

USER mysql
