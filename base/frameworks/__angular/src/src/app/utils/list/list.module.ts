import { NgModule } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

const modules = [
  NzTableModule,
  NzToolTipModule,
  NzIconModule,
  NzTagModule,
  NzTypographyModule,
  NzPopconfirmModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class ListModule { }
