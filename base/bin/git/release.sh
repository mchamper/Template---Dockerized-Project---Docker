#!/bin/bash

. .env || exit 1

SERVICE=${1}
VERSION=${2}
ONLY_FILES=${3}
DOCKER_SOURCE=$(pwd)

function release() {
  local source=${1}
  local version=${2}
  local only_files=${3}

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

    if [[ ${only_files} != "--files" ]]; then
      git add .
      git commit -m "Auto commit: Commit before version change init"
      bash base/bin/git/pull.sh ${SERVICE}
    fi

    if [[ -f package.json && ! -f composer.json ]]; then
      sed -i '0,/version/ s|\(.*"version"\): "\(.*\)",.*|\1: "'${version}'",|' package.json;

      if [[ -f package-lock.json ]]; then
        sed -i '1,15 s|\(.*"version"\): "\(.*\)",.*|\1: "'${version}'",|' package-lock.json;
      fi

      if [[ -f capacitor.config.ts ]]; then
        if [[ -f android/app/build.gradle  ]]; then
          sed -i 's|\(.*versionCode\) \(.*\)|echo "\1 $((\2+1))"|e' android/app/build.gradle;
          sed -i 's|\(.*versionName\) "\(.*\)"|\1 "'${version}'"|' android/app/build.gradle;
        fi

        if [[ -f ios/App/App.xcodeproj/project.pbxproj ]]; then
          sed -i 's|\(.*CURRENT_PROJECT_VERSION\) = \(.*\);|echo "\1 = $((\2+1));"|e' ios/App/App.xcodeproj/project.pbxproj;
          sed -i 's|\(.*MARKETING_VERSION\) = \(.*\);|\1 = '${version%%-*}';|' ios/App/App.xcodeproj/project.pbxproj;
        fi
      fi

      if [[ -f src/version.ts ]]; then
        echo "export const version = \"${version}\";" > src/version.ts
      else
        echo "export const version = \"${version}\";" > version.js
      fi
    else
      echo ${version} > version.txt
    fi

    if [[ ${only_files} != "--files" ]]; then
      git add .
      git commit -m "Auto commit: Version changed"
      git flow release start ${version} || exit 1
      git flow release finish ${version} -F -p -m "Auto release:"
    fi
  else
    echo "No git repository in \"${source}\""
  fi
}

for SRC in ${SRCS[@]}; do
  SRC_SERVICE=${SRC%%:*}
  SRC_SOURCE=${SRC##*:}

  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then release "${SRC_SOURCE}" ${VERSION} ${ONLY_FILES}; fi
  if [[ ${SERVICE} = ${SRC_SERVICE} ]]; then exit; fi
done

if [[ ${SERVICE} = "docker" ]]; then release "${DOCKER_SOURCE}" ${VERSION} ${ONLY_FILES}; fi
