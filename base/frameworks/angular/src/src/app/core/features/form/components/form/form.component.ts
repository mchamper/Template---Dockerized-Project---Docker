import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Form } from '../../form.class';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestComponent } from '../../../request/components/request/request.component';
import { FormFooterComponent } from '../form-footer/form-footer.component';
import { environment } from '../../../../../../environments/environment';
import { coreConfig } from '../../../../../configs/core.config';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RequestComponent,
    FormFooterComponent,
    NzFormModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {

  @Input({ required: true }) form!: Form;
  @Input({ transform: booleanAttribute }) debug = false;
  @Input({ transform: booleanAttribute }) floatingLabel = coreConfig.forms.floatingLabel;
  @Input({ transform: booleanAttribute }) forceSubmitOnEnter = false;
  @Input() type: 'default' | 'oneline' = coreConfig.forms.type;

  get showDebug(): boolean {
    return !environment.production && this.debug;
  }

}
