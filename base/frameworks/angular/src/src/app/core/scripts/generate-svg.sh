#!/bin/bash

FILES="src/app/components/svg/*.svg"
OUTPUT_TS="src/app/components/svg/svg.components.ts"
OUTPUT_SCSS="src/app/components/svg/svg.components.scss"

touch ${OUTPUT_TS}
echo "import { ChangeDetectionStrategy, Component } from '@angular/core';" > ${OUTPUT_TS}

for file in $FILES
do
  file=${file%%.*}
  file=${file##*/}

  component_name=$(echo ${file} | perl -pe 's/(^|-)(\w)/\U$2/g')

  cat <<EOT >> ${OUTPUT_TS}

@Component({
  selector: 'svg-${file}',
  standalone: true,
  templateUrl: './${file}.svg',
  styleUrls: ['./svg.components.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Svg${component_name}Component { }
EOT

done

touch ${OUTPUT_SCSS}
echo "" > ${OUTPUT_SCSS}
cat <<EOT >> ${OUTPUT_SCSS}
:host {
  display: inline-block;
}

:host::ng-deep {
  svg {
    width: 100%;
    height: 100%;
  }
}
EOT
