import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { AbstractActionGroupComponent } from '../../../core/components/action-groups/abstract-action-group.component';
import { SystemUserHttpService } from '../../../services/http/system-user-http.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { GlobalDeleteActionComponent } from '../../../core/components/actions/global-delete-action/global-delete-action.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { SystemUser } from '../../../models/system-user.model';
import { Request } from '../../../core/features/request/request.class';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AuthUserHttpService } from '../../../services/http/auth-user-http.service';

@Component({
  selector: 'app-system-user-action-group',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NzIconModule,
    NzToolTipModule,
    NzDropDownModule,
    NzSwitchModule,
    GlobalDeleteActionComponent,
  ],
  templateUrl: './system-user-action-group.component.html',
  styleUrl: './system-user-action-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserActionGroupComponent extends AbstractActionGroupComponent<
  | 'create'
  | 'update'
  | 'delete'
  | 'loginAs'
  | 'activate'
  | 'deactivate'
> {

  private _router = inject(Router);
  authS = inject(AuthService);
  authUserHttpS = inject(AuthUserHttpService);
  systemUserHttpS = inject(SystemUserHttpService);

  @Input() systemUser?: SystemUser;

  loginAsRequest!: Request;
  activateRequest!: Request;
  deactivateRequest!: Request;

  constructor() {
    super();

    this.actions = [
      {
        name: 'create',
        can: () => !!this.authS.systemUser().activeSession()?.can(['SystemUserCreate']),
      },
      {
        name: 'update',
        can: () => !!this.authS.systemUser().activeSession()?.can(['SystemUserUpdate']),
      },
      {
        name: 'delete',
        can: () => !!this.authS.systemUser().activeSession()?.can(['SystemUserDelete']),
      },
      {
        name: 'loginAs',
        can: () => this.systemUser!.isActive()
          && !!this.authS.systemUser().activeSession()?.can(['SystemUserLoginAs']),
      },
      {
        name: 'activate',
        can: () => !this.systemUser!.isActive()
          && (this.authS.systemUser().activeSession()?.hasRole(['Root']) || this.systemUser!.data.rolesAndPermissions.roles.includes('Admin'))
          && !!this.authS.systemUser().activeSession()?.can(['SystemUserActivate']),
      },
      {
        name: 'deactivate',
        can: () => this.systemUser!.isActive()
          && (this.authS.systemUser().activeSession()?.hasRole(['Root']) || this.systemUser!.data.rolesAndPermissions.roles.includes('Admin'))
          && !!this.authS.systemUser().activeSession()?.can(['SystemUserDeactivate']),
      },
    ];
  }

  ngOnInit() {
    this.loginAsRequest = new Request({
      bind: this.request,
      send: () => this.authUserHttpS.loginAs('systemUser', { user_id: this.systemUser!.data.id }),
      success: () => this._router.navigateByUrl('/bienvenido'),
      injector: this._injector,
    });

    this.activateRequest = new Request({
      bind: this.request,
      send: () => this.systemUserHttpS.activate(this.systemUser!.data.id),
      success: () => this.onSuccess$.emit({ action: 'activate' }),
      injector: this._injector,
    });

    this.deactivateRequest = new Request({
      bind: this.request,
      send: () => this.systemUserHttpS.deactivate(this.systemUser!.data.id),
      success: () => this.onSuccess$.emit({ action: 'deactivate', }),
      injector: this._injector,
    });
  }
}
