import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { List } from '../../list.class';
import { sumBy } from 'lodash';
import { ListShowTotalComponent } from '../list-show-total/list-show-total.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { RequestComponent } from '../../../request/components/request/request.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ListShowTotalComponent,
    RequestComponent,
    NzTableModule,
    NzIconModule,
    DragDropModule,
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
    rowTpl?: TemplateRef<{ $implicit: Item, index: number }>,
  }[];

  @Input({ transform: booleanAttribute }) dragable = false;
  @Output() onDrop$ = new EventEmitter<any>();

  get scrollSize() {
    return sumBy(this.columns.filter(column => !!column.rowTpl), item => !isNaN(parseInt(item.width)) ? parseInt(item.width) : 0) + 300 + 'px';
  }

  /* -------------------- */

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list.data(), event.previousIndex, event.currentIndex);
    this.onDrop$.emit();
  }
}
