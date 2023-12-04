import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemUserHttpService } from 'src/app/services/http/system-user-http.service';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RouteService } from 'src/app/services/route.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { SystemUser } from 'src/app/commons/models/system-user';
import { Request } from 'src/app/utils/request/request';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface SystemUserActionsSuccessEvent {
  action:
    | 'activate'
    | 'deactivate'
    | 'delete'
  ,
  data?: any,
}

@Component({
  selector: 'app-system-user-actions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzPopconfirmModule,
    NzToolTipModule,
    NzIconModule,
    NzDropDownModule,
  ],
  templateUrl: './system-user-actions.component.html',
  styleUrls: ['./system-user-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserActionsComponent implements OnInit {

  @Input({ required: true }) systemUser!: SystemUser | null;
  @Input() type: 'buttons' | 'dropdown' = 'buttons';
  @Input() notify = false;
  @Input() request = new Request();

  @Output() onSuccess$: EventEmitter<SystemUserActionsSuccessEvent> = new EventEmitter();

  activateRequest!: Request;
  deactivateRequest!: Request;
  deleteRequest!: Request;

  private _injector = inject(Injector);

  constructor(
    private _authS: AuthService,
    private _systemUserHttpS: SystemUserHttpService,
    private _routeS: RouteService,
  ) { }

  ngOnInit(): void {
    this.activateRequest = new Request({
      bind: this.request,
      send: () => this._systemUserHttpS.activate(this.systemUser?.data.id || 0),
      success: (res) => this.onSuccess$.emit({ action: 'activate', data: res.body.system_user }),
      notifySuccess: this.notify,
      injector: this._injector,
    });

    this.deactivateRequest = new Request({
      bind: this.request,
      send: () => this._systemUserHttpS.deactivate(this.systemUser?.data.id || 0),
      success: (res) => this.onSuccess$.emit({ action: 'activate', data: res.body.system_user }),
      notifySuccess: this.notify,
      injector: this._injector,
    });

    this.deleteRequest = new Request({
      bind: this.request,
      send: () => this._systemUserHttpS.delete(this.systemUser?.data.id || 0),
      success: (res) => this.onSuccess$.emit({ action: 'delete', data: res.body.system_user }),
      notifySuccess: this.notify,
      injector: this._injector,
    });
  }

  /* -------------------- */

  canShowActions(): boolean {
    return this.canShowToggleStatus()
      || this.canShowEdit()
      || this.canShowDelete();
  }

  canShowToggleStatus(): boolean {
    return this._authS.systemUser().can(['SystemUserActivate', 'SystemUserDeactivate']);
  }

  canShowEdit(): boolean {
    return this._routeS.currentPage().name !== 'SystemUserDetailPage';
  }

  canShowDelete(): boolean {
    return this._authS.systemUser().can('SystemUserDelete');
  }
}
