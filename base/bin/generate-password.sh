#!/bin/bash

LONG=${1:-32}

</dev/urandom tr -dc '1234567890!@#~%=(){}[],;.:+-_<>+qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM' | head -c$LONG; echo ""
