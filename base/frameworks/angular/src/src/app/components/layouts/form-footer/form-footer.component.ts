import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { LoadingBtnDirective } from 'src/app/directives/loading-btn.directive';
import { SharedModule } from 'src/app/shared.module';
import { Form } from 'src/app/utils/form/form';

@Component({
  selector: 'app-form-footer',
  standalone: true,
  imports: [
    SharedModule,
    LoadingBtnDirective,
    NzIconModule,
    NzAlertModule,
    NzAffixModule,
  ],
  templateUrl: './form-footer.component.html',
  styleUrls: ['./form-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFooterComponent {

  @Input({ required: true }) form!: Form;
  @Input({ required: true }) buttonText!: string;
  @Input() disabled?: boolean;

  @ContentChild('alert') alertTpl!: TemplateRef<any>;
}
