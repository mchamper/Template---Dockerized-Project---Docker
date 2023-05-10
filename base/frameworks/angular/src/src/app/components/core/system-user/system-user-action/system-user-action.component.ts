import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';
import { AbstractActionComponent } from 'src/app/commons/abstracts/abstract-action.component';
import { SystemUserHttpService } from 'src/app/services/http/system-user-http.service';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormModule } from 'src/app/utils/form/form.module';
import { ListModule } from 'src/app/utils/list/list.module';
import { RouteService } from 'src/app/services/route.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { SystemUser } from 'src/app/models/system-user';

@Component({
  selector: 'app-system-user-action',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ListModule,
    FormModule,
    NzDropDownModule
  ],
  templateUrl: './system-user-action.component.html',
  styleUrls: ['./system-user-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserActionComponent extends AbstractActionComponent  {

  @Input() systemUser!: SystemUser;
  @Input() systemUser$!: WritableSignal<SystemUser | null>;

  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    private _authS: AuthService,
    private _systemUserHttpS: SystemUserHttpService,
    private _routeS: RouteService,
  ) {

    super();
  }

  ngOnInit(): void {
    if (this.systemUser) {
      this.systemUser$ = signal(this.systemUser);
    }
  }

  ngOnDestroy(): void {
    this._sh.clean();
  }

  /* -------------------- */

  canShowToggleStatus(): boolean {
    return this._authS.can(['SystemUserActivate', 'SystemUserDeactivate']);
  }

  canShowEdit(): boolean {
    return this._routeS.currentPage$.value.name !== 'SystemUserDetailPage';
  }

  canShowDelete(): boolean {
    return this._authS.can('SystemUserDelete');
  }

  /* -------------------- */

  toggleStatus() {
    this.systemUser$()?.data.status === 'Active'
      ? this.deactivate()
      : this.activate();
  }

  activate() {
    this._sh.add(
      this._getForm().send(this._systemUserHttpS.activate(this.systemUser$()?.data.id || 0), {
        prepareOptions: { strict: false },
        success: (res) => {
          this.list
            ? this.list.setItem(res.body.system_user)
            : this.systemUser$.set(res.body.system_user);
        },
        notifySuccess: !this.list
      })?.subscribe()
    , 'activate');
  }

  deactivate() {
    this._sh.add(
      this._getForm().send(this._systemUserHttpS.deactivate(this.systemUser$()?.data.id || 0), {
        prepareOptions: { strict: false },
        success: (res) => {
          this.list
            ? this.list.setItem(res.body.system_user)
            : this.systemUser$.set(res.body.system_user);
        },
        notifySuccess: !this.list
      })?.subscribe()
    , 'deactivate');
  }

  delete() {
    this._sh.add(
      this._getForm().send(this._systemUserHttpS.delete(this.systemUser$()?.data.id || 0), {
        prepareOptions: { strict: false },
        success: (res) => {
          this.list
            ? this.list.setItem(res.body.system_user)
            : this.systemUser$.set(res.body.system_user);

          this.onDelete.emit();
        },
        notifySuccess: !this.list
      })?.subscribe()
    , 'delete');
  }
}
