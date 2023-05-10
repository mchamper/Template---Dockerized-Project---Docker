import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { LoadingBtnDirective } from 'src/app/directives/loading-btn.directive';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { FormControlDirective } from './directives/form-control.directive';

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
  NzUploadModule,
  LoadingBtnDirective,
  NgxMaskDirective,
  NgxMaskPipe,
  FormControlDirective,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class FormModule { }
