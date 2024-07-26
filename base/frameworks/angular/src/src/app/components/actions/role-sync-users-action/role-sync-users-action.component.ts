import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { AbstractActionComponent } from '../../../core/components/actions/abstract-action.component';
import { FormBuilder } from '@angular/forms';
import { RoleHttpService } from '../../../services/http/role-http.service';
import { Form } from '../../../core/features/form/form.class';
import { snakeCase } from 'lodash';
import { AppModule } from '../../../app.module';
import { FormModule } from '../../../core/features/form/form.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-role-sync-users-action',
  standalone: true,
  imports: [
    AppModule,
    FormModule,
    NzAlertModule,
    NzModalModule,
    NzPopoverModule,
  ],
  templateUrl: './role-sync-users-action.component.html',
  styleUrl: './role-sync-users-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleSyncUsersActionComponent extends AbstractActionComponent<'popover'> {

  @Input({ required: true }) role!: any;

  private _fb = inject(FormBuilder);
  private _roleHttpS = inject(RoleHttpService);

  form!: Form;

  get userComboName() {
    return `${snakeCase(this.role.guard_name.replace('api_', ''))}s`;
  }

  override onInit(): void {
    this.form = new Form(this._fb.group({
      users: this._fb.control([]),
    }), {
      dataRequest: {
        send: (): any => this._roleHttpS.getOne(this.role.id, {
          with: 'users'
        }),
        watch: 'role',
        success: (res) => this.form.set({ users: res.body.role.users}),
      },
      request: {
        send: (): any => this._roleHttpS.syncUsers(this.role.id, this.form.group.value),
        success: () => {
          this.close();
          this.onSuccess$.emit();
        },
        notify: true,
      },
      reset: true,
      combos: `${this.userComboName}`,
      injector: this._injector,
    });
  }

  override onClose(): void {
    this.form.cancelRequests();
  }
}
