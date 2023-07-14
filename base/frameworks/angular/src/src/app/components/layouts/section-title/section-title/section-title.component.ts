import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SharedModule } from 'src/app/shared.module';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [
    SharedModule,
    NzIconModule,
  ],
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionTitleComponent {

  @Input() reloadFn!: (() => any) | null;

  @ContentChild('extras') extrasTpl!: TemplateRef<any>;
  @ContentChild('breadcrumbs') breadcrumbsTpl!: TemplateRef<any>;
}
