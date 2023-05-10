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

  @Input() reloadFn!: () => any;

  @ContentChild('breadcrumbsTpl') breadcrumbsTpl!: TemplateRef<any>;
  @ContentChild('extrasTpl') extrasTpl!: TemplateRef<any>;
}
