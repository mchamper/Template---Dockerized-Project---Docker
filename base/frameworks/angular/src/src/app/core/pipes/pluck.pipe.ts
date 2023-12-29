import { Pipe, PipeTransform } from '@angular/core';
import { get, isArray } from 'lodash';

@Pipe({
  name: 'pluck',
  standalone: true,
})
export class PluckPipe implements PipeTransform {

  transform(value: any, field: string): any {
    if (!isArray(value) || !field) {
      return value;
    }

    return value.map((value: any) => {
      return get(value, field, null);
    });
  }
}
