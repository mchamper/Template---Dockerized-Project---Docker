import { Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], searchText: string, fields: string[] = []): any {
    return value.filter((item: any) => {
      return fields.some((field) => {
        const term = String(field ? get(item, field, '') : item);
        return term.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1;
      });
    });
  }
}
