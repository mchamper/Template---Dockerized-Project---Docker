ARG MSSQL_VERSION=2022-latest
FROM mcr.microsoft.com/mssql/server:${MSSQL_VERSION}

USER root

WORKDIR /docker
COPY bin /docker/bin
RUN addgroup docker && adduser docker --uid 1000 --gid 1000
RUN chown -R docker:docker /docker
ENV PATH="/home/docker/.local/bin:${PATH}"

##############################
##############################
