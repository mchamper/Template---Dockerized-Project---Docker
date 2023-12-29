import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RequestComponent } from '../../../request/components/request/request.component';
import { Form } from '../../form.class';
import { FormComponent } from '../form/form.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-filters',
  standalone: true,
  imports: [
    CommonModule,
    RequestComponent,
    FormComponent,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzIconModule,
    NzCollapseModule,
    NzDividerModule,
  ],
  templateUrl: './form-filters.component.html',
  styleUrls: ['./form-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFiltersComponent {

  @Input({ required: true }) form!: Form;
  @ContentChild('moreTpl') moreTpl!: TemplateRef<any>;
}
