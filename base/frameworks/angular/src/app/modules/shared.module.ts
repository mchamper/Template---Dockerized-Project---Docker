import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@NgModule({
  imports: [
    NzIconModule,
    NzButtonModule,
    NzSpinModule,
    NzPageHeaderModule,
    NzDividerModule,
    NzTypographyModule,
    NzCardModule,
    NzTagModule,
    NzToolTipModule,
    NzCollapseModule,
  ],
  exports: [
    NzIconModule,
    NzButtonModule,
    NzSpinModule,
    NzPageHeaderModule,
    NzDividerModule,
    NzTypographyModule,
    NzCardModule,
    NzTagModule,
    NzToolTipModule,
    NzCollapseModule,
  ]
})
export class SharedModule { }
