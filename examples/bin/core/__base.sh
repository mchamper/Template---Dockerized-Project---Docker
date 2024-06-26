#!/bin/bash

. .env || exit 1

THIS=${0}; CMD=${1}; ARG1=${2}; ARG2=${3}; ARG3=${4}; ARG4=${5}; ARG5=${6}; ARG6=${9}; ARG7=${8}; ARG8=${9};

if [[ ${CMD} = "-v" ]]; then
  VERSION=${ARG1}
  COMMIT=${ARG2}

  if [[ ${VERSION} != "" ]]; then
    bash base/bin/git/release.sh ${SERVICE} "${VERSION}" ${COMMIT}; else
    bash base/bin/git/version.sh ${SERVICE}; fi

  exit
fi

if [[ ${CMD} = "clone" ]]; then
  GIT_FLOW_STR=""

  if [[ ${ARG1} = "--url" ]]; then echo "${GIT_URL}"; exit; fi
  if [[ ${GIT_FLOW} = true ]]; then GIT_FLOW_STR="--flow"; fi

  bash base/bin/git/clone.sh ${SERVICE} "${GIT_URL}" "${GIT_BRANCH}" "${GIT_FLOW_STR}" || exit 1
  exit
fi

if [[ ${CMD} = "publish" ]]; then
  bash base/bin/git/publish.sh ${SERVICE} ${ARG1}
  exit
fi

if [[ ${CMD} = "sync" ]]; then
  bash base/bin/git/sync.sh ${SERVICE} ${ARG1}
  exit
fi

if [[ ${CMD} = "branch" ]]; then
  bash base/bin/git/branch.sh ${SERVICE}
  exit
fi

if [[ ${CMD} = "create" ]]; then
  bash base/bin/create-project/${ARG1}.sh ${SERVICE} "${ARG2}" "${ARG3}" "${ARG4}" "${ARG5}"
  exit
fi

if [[ ${CMD} = "run" ]]; then
  bash base/bin/docker/run.sh ${SERVICE} "${ARG1}"
  exit
fi

if [[ ${CMD} = "exec" ]]; then
  bash base/bin/docker/exec.sh ${SERVICE} "${ARG1}"
  exit
fi

if [[ ${CMD} = "attach" ]]; then
  bash base/bin/docker/attach.sh ${SERVICE} "${ARG1}"
  exit
fi

##############################

if [[ ${CMD} = "eb-ssh" ]]; then
  bash base/bin/aws/eb-ssh.sh ${SERVICE}-aws "${ARG1}"
  exit
fi

if [[ ${CMD} = "ssh" ]]; then
  bash ${THIS} run "ssh -i ${SSH_FILE} ${SSH_USER} -p ${SSH_PORT:-22} \"${ARG1}\""
  exit
fi

if [[ ${CMD} = "ssh-download" ]]; then
  bash ${THIS} run "rsync -avz --delete -e \"ssh -i ${SSH_FILE} -p ${SSH_PORT:-22}\" ${SSH_USER}:${ARG1} ${ARG2}"
  exit
fi

if [[ ${CMD} = "ssh-upload" ]]; then
  bash ${THIS} run "rsync -avz --delete -e \"ssh -i ${SSH_FILE} -p ${SSH_PORT:-22}\" ${ARG1} ${SSH_USER}:${ARG2}"
  exit
fi

if [[ ${CMD} = "ssh-scp-download" ]]; then
  bash ${THIS} run "scp -i ${SSH_FILE} -P ${SSH_PORT:-22} ${SSH_USER}:${ARG1} ${ARG2}"
  exit
fi

if [[ ${CMD} = "ssh-scp-upload" ]]; then
  bash ${THIS} run "scp -i ${SSH_FILE} -P ${SSH_PORT:-22} ${ARG1} ${SSH_USER}:${ARG2}"
  exit
fi

if [[ ${CMD} = "echo-ssh-download" ]]; then
  echo "$(bash ${THIS} ssh "cat ${ARG1}")" > "${ARG2}"
  exit
fi

if [[ ${CMD} = "echo-ssh-upload" ]]; then
  bash ${THIS} ssh "echo '$(cat ${ARG1})' > ${ARG2}"
  exit
fi

##############################

if [[ ${CMD} = "npm" ]]; then
  bash ${THIS} run "npm run ${ARG1}"
  exit
fi

if [[ ${CMD} = "yarn" ]]; then
  bash ${THIS} run "yarn ${ARG1}"
  exit
fi

if [[ ${CMD} = "composer" ]]; then
  bash ${THIS} run "composer ${ARG1}"
  exit
fi

if [[ ${CMD} = "artisan" ]]; then
  bash ${THIS} run "php artisan ${ARG1}"
  exit
fi

if [[ ${CMD} = "ng" ]]; then
  bash ${THIS} run "ng ${ARG1}"
  exit
fi

##############################

if [[ ${CMD} = "npm-clean" ]]; then
  bash ${THIS} run "rm -rf node_modules"
  exit
fi

if [[ ${CMD} = "npm-install" ]]; then
  if [[ ${ARG1} = "--clean" ]]; then bash ${THIS} npm-clean; fi
  bash ${THIS} run "npm install"

  exit
fi

if [[ ${CMD} = "npm-add" ]]; then
  bash ${THIS} run "npm install ${ARG1}"
  exit
fi

if [[ ${CMD} = "npm-add-dev" ]]; then
  bash ${THIS} run "npm install --save-dev ${ARG1}"
  exit
fi

if [[ ${CMD} = "npm-remove" ]]; then
  bash ${THIS} run "npm uninstall ${ARG1}"
  exit
fi

if [[ ${CMD} = "npm-build" ]]; then
  if [[ ${ARG1} = "--clean" ]]; then bash ${THIS} npm-clean; fi
  bash ${THIS} run "npm install && npm run build"

  exit
fi

if [[ ${CMD} = "yarn-install" ]]; then
  if [[ ${ARG1} = "--clean" ]]; then bash ${THIS} npm-clean; fi
  bash ${THIS} run "yarn install"

  exit
fi

if [[ ${CMD} = "yarn-add" ]]; then
  bash ${THIS} run "yarn add ${ARG1}"
  exit
fi

if [[ ${CMD} = "yarn-remove" ]]; then
  bash ${THIS} run "yarn remove ${ARG1}"
  exit
fi

if [[ ${CMD} = "yarn-build" ]]; then
  if [[ ${ARG1} = "--clean" ]]; then bash ${THIS} npm-clean; fi
  bash ${THIS} run "yarn install && yarn build"

  exit
fi

if [[ ${CMD} = "composer-clean" ]]; then
  bash ${THIS} run "rm -rf vendor"
  exit
fi

if [[ ${CMD} = "composer-install" ]]; then
  if [[ ${ARG1} = "--clean" ]]; then bash ${THIS} composer-clean; fi
  bash ${THIS} run "composer install"

  exit
fi

if [[ ${CMD} = "composer-require" ]]; then
  bash ${THIS} run "composer require ${ARG1}"
  exit
fi

if [[ ${CMD} = "composer-dump-autoload" ]]; then
  bash ${THIS} run "composer dump-autoload"
  exit
fi

##############################

if [[ ${CMD} = "laravel-remove-cache" ]]; then
  bash base/bin/docker/exec-as.sh ${SERVICE} "
    GLOBIGNORE=.gitignore
    rm -r storage/framework/cache/data/*
    unset GLOBIGNORE
  " root

  exit
fi

##############################

if [[ ${CMD} = "locust-start" ]]; then
  bash ${THIS} exec "cd locust && locust"
  exit
fi

##############################

if [[ ${CMD} = "hls-create" ]]; then
  FILE_PATH=${ARG1}
  FILE_TIME=${ARG2:-5}

  bash ${THIS} run "ffmpeg -i ${FILE_PATH}.mp4 -codec: copy -start_number 0 -hls_time ${FILE_TIME} -hls_list_size 0 -f hls ${FILE_PATH}.m3u8"

  exit
fi
