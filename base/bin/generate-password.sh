#!/bin/bash

LONG=${1:-32}
CHARSET='A-Za-z0-9@#~%&=(){}[],;.:+\-_<>'

</dev/urandom LC_ALL=C tr -dc ${CHARSET} | head -c ${LONG}; echo
