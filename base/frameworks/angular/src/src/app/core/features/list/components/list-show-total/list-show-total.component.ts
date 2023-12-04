import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-show-total',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <ng-template #tpl let-total let-range="range">
      <small>{{ range[0] | number }} - {{ range[1] | number }} de {{ total | number }} registros</small>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListShowTotalComponent {

  @ViewChild('tpl') tpl!: TemplateRef<any>;
}
