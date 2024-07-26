import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RoleHttpService } from '../../../services/http/role-http.service';
import { Form } from '../../../core/features/form/form.class';
import { AbstractActionComponent } from '../../../core/components/actions/abstract-action.component';
import { AppModule } from '../../../app.module';
import { FormModule } from '../../../core/features/form/form.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-role-update-action',
  standalone: true,
  imports: [
    AppModule,
    FormModule,
    NzAlertModule,
    NzModalModule,
    NzPopoverModule,
  ],
  templateUrl: './role-update-action.component.html',
  styleUrl: './role-update-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleUpdateActionComponent extends AbstractActionComponent<'popover'> {

  @Input({ required: true }) role!: any;

  private _fb = inject(FormBuilder);
  private _roleHttpS = inject(RoleHttpService);

  form!: Form;

  override onInit(): void {
    this.form = new Form(this._fb.group({
      name: this._fb.control(this.role.name, { validators: [Validators.required]}),
    }), {
      request: {
        send: (): any => this._roleHttpS.update(this.role.id, this.form.group.value),
        success: () => {
          this.close();
          this.onSuccess$.emit();
        },
        notify: true,
      },
      reset: true,
      injector: this._injector,
    });
  }

  override onClose(): void {
    this.form.cancelRequests();
  }
}
