#!/bin/bash

. .env || exit 1

SERVICE=${1}
VERSION=${2}
COMMIT=${3}
DOCKER_SOURCE=$(pwd)

function release() {
  local source=${1}
  local version=${2}
  local commit=${3}

  cd "${DOCKER_SOURCE}"
  cd "${source}" || exit 1

  if [[ -d .git ]]; then
    if [[ ${version} = "" ]]; then
      exit
    fi

    if [[ ${version} = "-v" ]]; then
      git describe --tags --abbrev=0
      exit
    fi

    if [[ ${commit} = "--commit" ]]; then
      git add .
      git commit -m "Auto commit: Commit before version change"
      bash base/bin/git/pull.sh ${SERVICE}
    fi

    edit_files ${version}

    if [[ ${commit} = "--commit" ]]; then
      git add .
      git commit -m "Auto commit: Version changed"
      git flow release start ${version} || exit 1
      git flow release finish ${version} -F -p -m "Auto release:"
    fi
  else
    echo "No git repository in \"${source}\""
    edit_files ${version}
  fi
}

function edit_files() {
  if [[ ! -f version.txt ]]; then touch version.txt; fi

  local version_new=${1}
  local version_code=$(sed -n '1p' version.txt)
  local version_name=$(sed -n '2p' version.txt)
  local version_raw=""

  if [[ ${version_new} != ${version_name} ]]; then
    version_code=$((${version_code:-0} + 1))
    version_name=${version_new}
  fi

  version_raw=${version_name%%-*}

  echo ${version_code} > version.txt
  echo ${version_name} >> version.txt

  if [[ -f package.json && ! -f composer.json ]]; then
    sed -i '0,/version/ s|\(.*"version"\): "\(.*\)",.*|\1: "'${version_name}'",|' package.json

    if [[ -f package-lock.json ]]; then
      sed -i '0,/version/ s|\(.*"version"\): "\(.*\)",.*|\1: "'${version_name}'",|' package-lock.json
    fi

    if [[ -f capacitor.config.ts ]]; then
      if [[ -f android/app/build.gradle  ]]; then
        sed -i 's|\(.*versionCode\) \(.*\)|\1 '${version_code}'|' android/app/build.gradle;
        sed -i 's|\(.*versionName\) "\(.*\)"|\1 "'${version_name}'"|' android/app/build.gradle;
      fi

      if [[ -f ios/App/App.xcodeproj/project.pbxproj ]]; then
        sed -i 's|\(.*CURRENT_PROJECT_VERSION\) = \(.*\);|\1 = '${version_code}';|' ios/App/App.xcodeproj/project.pbxproj;
        sed -i 's|\(.*MARKETING_VERSION\) = \(.*\);|\1 = '${version_raw}';|' ios/App/App.xcodeproj/project.pbxproj;
      fi
    fi

    VERSION_FILE_PATH="version"

    if [[ -f tsconfig.json ]]; then
      if [[ -d src ]]; then VERSION_FILE_PATH="src/version"; fi

      echo "export const versionCode = ${version_code};" > ${VERSION_FILE_PATH}.ts
      echo "export const versionName = \"${version_name}\";" >> ${VERSION_FILE_PATH}.ts
    else
      echo "export const versionCode = ${version_code};" > ${VERSION_FILE_PATH}.js
      echo "export const versionName = \"${version_name}\";" >> ${VERSION_FILE_PATH}.js
    fi
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then release "${SRC_SOURCE}" ${VERSION} ${COMMIT}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done

if [[ ${SERVICE} = "docker" ]]; then release "${DOCKER_SOURCE}" ${VERSION} ${COMMIT}; fi
