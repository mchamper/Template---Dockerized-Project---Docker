#!/bin/bash

. ../.env

rm -rf .$SRC_WEB
rm -rf .$SRC_MOBILE
rm -rf .$SRC_BACKOFFICE
rm -rf .$SRC_BACKEND

sh sources-create.sh
