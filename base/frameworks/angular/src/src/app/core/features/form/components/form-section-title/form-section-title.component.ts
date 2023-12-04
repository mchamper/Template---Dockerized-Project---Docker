import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-form-section-title',
  standalone: true,
  imports: [
    CommonModule,
    NzDividerModule,
    NzIconModule,
  ],
  templateUrl: './form-section-title.component.html',
  styleUrls: ['./form-section-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSectionTitleComponent {

  @Input({ required: true }) title!: string;
  @Input({ transform: booleanAttribute }) isFirst: boolean = false;
  @Input() icon!: string;
}
