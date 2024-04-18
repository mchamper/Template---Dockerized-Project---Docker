import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlDirective } from './directives/form-control.directive';
import { FormComponent } from './components/form/form.component';
import { FormUploadComponent } from './components/form-upload/form-upload.component';
import { LoadingButtonDirective } from '../../directives/loading-button.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { RequestComponent } from '../request/components/request/request.component';
import { FormFooterComponent } from './components/form-footer/form-footer.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormFiltersComponent } from './components/form-filters/form-filters.component';

const modules = [
  FormsModule,
  ReactiveFormsModule,
  FormControlDirective,
  FormComponent,
  FormFiltersComponent,
  FormFooterComponent,
  FormUploadComponent,
  NzFormModule,
  NzInputModule,
  NzInputNumberModule,
  NzSelectModule,
  NzCheckboxModule,
  NzDatePickerModule,
  NzRadioModule,
  NzUploadModule,
  NzDividerModule,
  NgxMaskDirective,
  NgxMaskPipe,
  LoadingButtonDirective,
  RequestComponent,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class FormModule { }
