import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { AbstractActionGroupComponent } from '../../../core/components/action-groups/abstract-action-group.component';
import { AuthService } from '../../../services/auth.service';
import { RoleHttpService } from '../../../services/http/role-http.service';
import { AppModule } from '../../../app.module';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { GlobalDeleteActionComponent } from '../../../core/components/actions/global-delete-action/global-delete-action.component';
import { RoleUpdateActionComponent } from '../../actions/role-update-action/role-update-action.component';
import { RoleSyncPermissionsActionComponent } from '../../actions/role-sync-permissions-action/role-sync-permissions-action.component';
import { RoleSyncUsersActionComponent } from '../../actions/role-sync-users-action/role-sync-users-action.component';

@Component({
  selector: 'app-role-action-group',
  standalone: true,
  imports: [
    AppModule,
    FormsModule,
    NzIconModule,
    NzToolTipModule,
    NzDropDownModule,
    RoleUpdateActionComponent,
    RoleSyncPermissionsActionComponent,
    RoleSyncUsersActionComponent,
    GlobalDeleteActionComponent,
  ],
  templateUrl: './role-action-group.component.html',
  styleUrl: './role-action-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleActionGroupComponent extends AbstractActionGroupComponent<
| 'update'
| 'sync-permissions'
| 'sync-users'
| 'delete'
> {

  authS = inject(AuthService);
  roleHttpS = inject(RoleHttpService);

  @Input() role?: any;

  constructor() {
    super();

    this.actions = [
      {
        name: 'update',
        can: () => !!this.role.created_at
          && !!this.authS.systemUser().activeSession()?.can(['RoleUpdate']),
      },
      {
        name: 'sync-permissions',
        can: () => !!this.role.created_at
          && !!this.authS.systemUser().activeSession()?.can(['RoleSyncPermission']),
      },
      {
        name: 'sync-users',
        can: () => !!this.authS.systemUser().activeSession()?.can(['RoleSyncUser']),
      },
      {
        name: 'delete',
        can: () => !!this.role.created_at
          && !!this.authS.systemUser().activeSession()?.can(['RoleDelete']),
      },
    ];
  }
}
