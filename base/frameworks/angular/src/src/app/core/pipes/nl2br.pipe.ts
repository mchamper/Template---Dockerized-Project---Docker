import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nl2br',
  standalone: true,
})
export class Nl2BrPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\r?\n|\r/g, '<br>');
  }

}
