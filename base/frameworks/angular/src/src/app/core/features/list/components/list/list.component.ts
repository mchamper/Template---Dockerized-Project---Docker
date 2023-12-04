import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from '../../list.class';
import { sumBy } from 'lodash';
import { ListShowTotalComponent } from '../list-show-total/list-show-total.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RequestComponent } from '../../../request/components/request/request.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ListShowTotalComponent,
    RequestComponent,
    NzTableModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent<Item = any> {

  @Input({ required: true }) list!: List<Item>;
  @Input({ required: true }) columns!: {
    width: string,
    name: string,
    key?: string,
    sort?: boolean,
    align?: 'left' | 'center' | 'right',
    right?: string | boolean,
    rowTpl: TemplateRef<{ $implicit: Item }>,
  }[];

  @ContentChild('filtersTpl') filtersTpl!: TemplateRef<any>;

  get scrollSize() {
    return sumBy(this.columns, item => !isNaN(parseInt(item.width)) ? parseInt(item.width) : 0) + 300 + 'px';
  }
}
