import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractActionComponent } from '../../../core/components/actions/abstract-action.component';
import { AppModule } from '../../../app.module';
import { FormModule } from '../../../core/features/form/form.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { List } from '../../../core/features/list/list.class';
import { FormBuilder, Validators } from '@angular/forms';
import { RoleHttpService } from '../../../services/http/role-http.service';
import { Form } from '../../../core/features/form/form.class';
import { ListModule } from '../../../core/features/list/list.module';
import { RoleActionGroupComponent } from '../../action-groups/role-action-group/role-action-group.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-role-list-action',
  standalone: true,
  imports: [
    AppModule,
    FormModule,
    NzAlertModule,
    NzModalModule,
    NzPopoverModule,
    ListModule,
    RoleActionGroupComponent,
  ],
  templateUrl: './role-list-action.component.html',
  styleUrl: './role-list-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListActionComponent extends AbstractActionComponent<'modal'> {

  private _fb = inject(FormBuilder);
  private _roleHttpS = inject(RoleHttpService);
  authS = inject(AuthService);

  formCreate = new Form(this._fb.group({
    name: this._fb.control('', { validators: [Validators.required]}),
    guard_name: this._fb.control('api_system-user', { validators: [Validators.required]}),
  }), {
    request: {
      send: (): any => this._roleHttpS.create(this.formCreate.group.value),
      success: () => (this.formCreate.restore(), this.list.refresh()),
    }
  });

  list!: List;

  override onInit(): void {
    this.formCreate.restore();

    this.list = new List({
      limit: 0,
      request: {
        send: (): any => this._roleHttpS.getList({
          limit: this.list.limit(),
        }),
        watch: 'roles',
      },
      injector: this._injector,
    });
  }

  override onClose(): void {
    this.list.cancelRequests();
    this.formCreate.cancelRequests();
  }
}
