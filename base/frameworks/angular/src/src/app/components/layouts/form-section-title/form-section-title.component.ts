import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SharedModule } from 'src/app/shared.module';

@Component({
  selector: 'app-form-section-title',
  standalone: true,
  imports: [
    SharedModule,
    NzDividerModule,
    NzIconModule,
  ],
  templateUrl: './form-section-title.component.html',
  styleUrls: ['./form-section-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSectionTitleComponent {

  @Input() title!: string;
  @Input() icon!: string;
  @Input() isFirst: boolean = false;
}
