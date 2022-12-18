#!/bin/bash

FILES="*.svg"
OUTPUT="svg.components.ts"

touch ${OUTPUT}
echo "import { ChangeDetectionStrategy, Component } from '@angular/core';" > ${OUTPUT}

for file in $FILES
do
  file=${file%%.*}
  component_name=$(echo ${file} | perl -pe 's/(^|-)(\w)/\U$2/g')

  cat <<EOT >> ${OUTPUT}

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
