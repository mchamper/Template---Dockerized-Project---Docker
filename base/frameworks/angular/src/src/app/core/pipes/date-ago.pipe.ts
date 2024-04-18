import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateAgo',
  standalone: true
})
export class DateAgoPipe implements PipeTransform {

  private _translateS = inject(TranslateService);

  transform(value: string): string {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

      if (seconds < 29) {
        return this._translateS.instant('core.pipes.date_ago.seconds_ago');
      }

      const intervals: any = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };

      let counter;

      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);

        if (counter > 0) {
          let iTranslated = '';

          if (counter === 1) {
            iTranslated = this._translateS.instant(`core.pipes.date_ago.intervals.${i}.singular`);
          } else {
            iTranslated = this._translateS.instant(`core.pipes.date_ago.intervals.${i}.plural`);
          }

          return this._translateS.instant('core.pipes.date_ago.ago', { counter: counter, interval: iTranslated });
        }
      }
    }

    return value;
  }
}
