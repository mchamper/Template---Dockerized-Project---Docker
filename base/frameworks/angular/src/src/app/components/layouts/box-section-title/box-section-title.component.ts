import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, booleanAttribute } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-box-section-title',
  standalone: true,
  imports: [
    CommonModule,
    NzDividerModule,
    NzIconModule,
  ],
  templateUrl: './box-section-title.component.html',
  styleUrls: ['./box-section-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxSectionTitleComponent {

  @Input({ required: true }) title!: string;
  @Input({ transform: booleanAttribute }) isFirst: boolean = false;
  @Input() icon!: string;

  @ContentChild('extrasTpl') extrasTpl!: TemplateRef<any>;
}
