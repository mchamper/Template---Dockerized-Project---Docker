import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { stringToObject } from 'src/app/helper';
import { SystemUserHttpService } from 'src/app/services/http/system-user-http.service';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { List } from 'src/app/utils/list/list';
import { ListModule } from 'src/app/utils/list/list.module';
import { FiltersComponent } from 'src/app/components/layouts/filters/filters.component';
import { FormBuilder } from '@angular/forms';
import { SystemUserActionComponent, SystemUserActionSuccessEvent } from 'src/app/components/core/system-user/system-user-action/system-user-action.component';
import { SystemUser } from 'src/app/commons/models/system-user';
import { SectionTitleComponent } from 'src/app/components/layouts/section-title/section-title/section-title.component';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';
import { Form } from 'src/app/utils/form/form';

@Component({
  selector: 'app-system-users-page',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    RequestComponent,
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

  constructor(
    public authS: AuthService,
    private _systemUserHttpS: SystemUserHttpService,
    private _fb: FormBuilder,
  ) {

    this.list = new List('LaravelPage', {
      persistOnUrl: true,
      request: {
        send: (page: number = 1, reset?: boolean) => {
          if (reset) this.list.reset();

          const filters: any = {
            'filters.id|!eq': this.authS.systemUser().data()?.id,
            'filters.type|in': this.list.filters.getValue('types').join(','),
            'filters.status|in': this.list.filters.getValue('statuses').join(','),
            'filters.email|-like-': this.list.filters.getValue('email'),
            'filters.channels|has.filters.id|in': this.list.filters.getValue('channels').join(','),
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
            limit: this.list.limit(),
            sort: this.list.sort() || '-created_at',
            with: 'channel,channels',
            ...stringToObject(filters, true),
          };

          return this._systemUserHttpS.getList(params);
        },
        body: 'system_users',
        success: () => this.list.set(this.list.request.body()),
      },
      filters: new Form(this._fb.group({
        types: [[]],
        statuses: [[]],
        name: [''],
        email: [''],
        channels: [[]],
        createdAt: [[]],
        emailVerified: [false],
        emailNotVerified: [false],
      }), {
        combos: `system_user_types,system_user_statuses,channels`,
      }),
    });
  }

  /* -------------------- */

  onActionSuccess(event: SystemUserActionSuccessEvent) {
    this.list.refresh();
  }
}
