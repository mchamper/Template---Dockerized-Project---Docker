import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { List } from 'src/app/utils/list/list';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    SharedModule,
    RequestComponent,
    FormModule,
    NzIconModule,
    NzCollapseModule,
    NzDividerModule,
  ],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent {

  @Input() list!: List;

  @ContentChild('moreFilters') moreFiltersTpl!: TemplateRef<any>;

  constructor(
    //
  ) { }
}