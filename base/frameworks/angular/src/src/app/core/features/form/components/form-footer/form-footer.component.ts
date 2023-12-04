import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, Optional, TemplateRef, booleanAttribute, inject } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { CommonModule } from '@angular/common';
import { LoadingButtonDirective } from '../../../../directives/loading-button.directive';
import { Form } from '../../form.class';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-form-footer',
  standalone: true,
  imports: [
    CommonModule,
    LoadingButtonDirective,
    NzIconModule,
    NzAlertModule,
    NzAffixModule,
  ],
  templateUrl: './form-footer.component.html',
  styleUrls: ['./form-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFooterComponent implements OnInit {

  @Optional() parentFormC = inject(FormComponent);

  @Input() form!: Form;
  @Input({ required: true }) submitText!: string;
  @Input() submitPlacement: 'left' | 'center' | 'right' | 'block' = 'left';
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) withInfo: boolean = false;
  @Input({ transform: booleanAttribute }) sticky: boolean = false;

  @ContentChild('alertTpl') alertTpl!: TemplateRef<any>;

  ngOnInit(): void {
    if (!this.form) {
      this.form = this.parentFormC.form;
    }
  }
}
