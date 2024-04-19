import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateToday',
  standalone: true
})
export class DateTodayPipe implements PipeTransform {

  private _translateS = inject(TranslateService);

  transform(value: string | Date): string | null {
    if (value) {
      if (typeof value === 'string') {
        value = new Date(value);
      }

      const today = new Date();
      const yesterday = new Date(today);

      yesterday.setDate(yesterday.getDate() - 1);

      if (value.getFullYear() == today.getFullYear() && value.getMonth() == today.getMonth() && value.getDate() == today.getDate())
        return this._translateS.instant('core.pipes.date_today.today');
      else if (value.getFullYear() == yesterday.getFullYear() && value.getMonth() == yesterday.getMonth() && value.getDate() == yesterday.getDate())
        return this._translateS.instant('core.pipes.date_today.yesterday');
      else{
        return null;
      }
    }

    return value;
  }
}
