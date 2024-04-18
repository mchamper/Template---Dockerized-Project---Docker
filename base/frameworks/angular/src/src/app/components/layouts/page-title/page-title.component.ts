import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
  ],
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent {

  @Input() reloadFn!: (() => any) | null;

  @ContentChild('extrasTpl') extrasTpl!: TemplateRef<any>;
  @ContentChild('breadcrumbsTpl') breadcrumbsTpl!: TemplateRef<any>;
}
