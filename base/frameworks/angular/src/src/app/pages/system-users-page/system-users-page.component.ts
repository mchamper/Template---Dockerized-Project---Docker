import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { stringToObject } from 'src/app/helper';
import { SystemUserHttpService } from 'src/app/services/http/system-user-http.service';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { RequestHandlerComponent } from 'src/app/utils/handlers/request-handler/components/request-handler/request-handler.component';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { List } from 'src/app/utils/list/list';
import { ListModule } from 'src/app/utils/list/list.module';
import { FiltersComponent } from 'src/app/components/layouts/filters/filters.component';
import { CombosHttpService } from 'src/app/services/http/combos-http.service';
import { FormBuilder } from '@angular/forms';
import { Form } from 'src/app/utils/form/form';
import { SectionTitleComponent } from 'src/app/components/layouts/section-title/section-title.component';
import { SystemUserActionComponent } from 'src/app/components/core/system-user/system-user-action/system-user-action.component';
import { SystemUser } from 'src/app/models/system-user';

@Component({
  selector: 'app-system-users-page',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    RequestHandlerComponent,
    ListModule,
    FormModule,
    FiltersComponent,
    SectionTitleComponent,
    SystemUserActionComponent,
  ],
  templateUrl: './system-users-page.component.html',
  styleUrls: ['./system-users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SystemUsersPageComponent {

  list: List<SystemUser>;

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    private _authS: AuthService,
    private _systemUserHttpS: SystemUserHttpService,
    private _combosHttpS: CombosHttpService,
    private _fb: FormBuilder,
  ) {

    this.list = new List<SystemUser>('LaravelPage');

    this.list.filters = new Form(this._fb.group({
      statuses: [[]],
      name: [''],
      email: [''],
      createdAt: [[]],
      emailVerified: [false],
      emailNotVerified: [false],
    }));

    this.getCombos();

    this._sh.add(
      this.list.init(this.getList, {
        persistOnUrl: true
      })
    );
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._sh.clean();
  }

  /* -------------------- */

  getCombos() {
    this._sh.add(
      this.list.filters.send(this._combosHttpS.get('system_user_statuses'), {
        request: 'combos',
        success: (res) => {
          this.list.filters.combos = res.body.combos;
        },
      })?.subscribe()
    , 'getCombos');
  }

  getList = (page: number = 1, reset?: boolean) => {
    if (reset) this.list.reset();

    const filters: any = {
      'filters.id|!eq': this._authS.data('systemUser')?.id,
      'filters.status|in': this.list.filters.getValue('statuses').join(','),
      'filters.email|-like-': this.list.filters.getValue('email'),
      'filters.created_at|between': this.list.filters.getValue('createdAt').map((item: Date) => moment(item).format('YYYY-MM-DD')).join(','),
      'advFilters._groupA:or.email_verified_at|!null': this.list.filters.getValue('emailVerified'),
      'advFilters._groupA:or.email_verified_at|null': this.list.filters.getValue('emailNotVerified'),
    };

    for (const [i, value] of (this.list.filters.getValue('name').split(' ') || []).entries()) {
      filters[`advFilters._groupB${i}:or.first_name|-like-`] = value;
      filters[`advFilters._groupB${i}:or.last_name|-like-`] = value;
    }

    const params = {
      page,
      limit: this.list.limit,
      sort: this.list.sort || '-created_at',
      ...stringToObject(filters, true),
    };

    this._sh.add(
      this.list.send(this._systemUserHttpS.getList(params), {
        success: (res) => {
          this.list.set(res.body?.system_users);
        },
      })?.subscribe()
    , 'getList');
  }

  /* -------------------- */

  toggleStatus(systemUser: any) {
    systemUser.status === 'Active'
      ? this.deactivate(systemUser)
      : this.activate(systemUser);
  }

  activate(systemUser: any) {
    this._sh.add(
      this.list.action.send(this._systemUserHttpS.activate(systemUser.id), {
        prepareOptions: { strict: false },
        success: (res) => {
          this.list.setItem(res.body.system_user);
        },
      })?.subscribe()
    , 'activate');
  }

  deactivate(systemUser: any) {
    this._sh.add(
      this.list.action.send(this._systemUserHttpS.deactivate(systemUser.id), {
        prepareOptions: { strict: false },
        success: (res) => {
          this.list.setItem(res.body.system_user);
        },
      })?.subscribe()
    , 'deactivate');
  }

  delete(systemUser: any) {
    this._sh.add(
      this.list.action.send(this._systemUserHttpS.delete(systemUser.id), {
        prepareOptions: { strict: false },
        success: (res) => {
          this.list.setItem(res.body.system_user);
        },
      })?.subscribe()
    , 'delete');
  }
}
