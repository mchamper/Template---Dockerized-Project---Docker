import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgxMaskModule } from 'ngx-mask';
import { LoadingBtnDirective } from 'src/app/directives/loading-btn.directive';
import { FormItemComponent } from './form-item/form-item.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';

const modules = [
  FormsModule,
  ReactiveFormsModule,
  NzFormModule,
  NzInputModule,
  NzInputNumberModule,
  NzSelectModule,
  NzCheckboxModule,
  NzDatePickerModule,
  NzRadioModule,
  LoadingBtnDirective,
  NgxMaskModule,
  FormItemComponent,
  FormGroupComponent,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class FormModule { }