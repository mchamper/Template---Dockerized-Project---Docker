import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppModule } from '../../app.module';
import { PageTitleComponent } from '../../components/layouts/page-title/page-title.component';
import { ListModule } from '../../core/features/list/list.module';
import { List } from '../../core/features/list/list.class';
import { SystemUser } from '../../models/system-user.model';
import { betweenDatesMapper } from '../../core/utils/mappers/between-dates.mapper';
import { SystemUserHttpService } from '../../services/http/system-user-http.service';
import { stringToObjectParser } from '../../core/utils/parsers/string-to-object.parser';
import { Form } from '../../core/features/form/form.class';
import { FormBuilder } from '@angular/forms';
import { FormModule } from '../../core/features/form/form.module';
import { RouterLink } from '@angular/router';
import { SystemUserActionGroupComponent } from '../../components/action-groups/system-user-action-group/system-user-action-group.component';
import { SystemUserListComponent } from '../../components/lists/system-user-list/system-user-list.component';

@Component({
  selector: 'app-system-user-list-page',
  standalone: true,
  imports: [
    AppModule,
    PageTitleComponent,
    ListModule,
    FormModule,
    RouterLink,
    SystemUserActionGroupComponent,
    SystemUserListComponent,
  ],
  templateUrl: './system-user-list-page.component.html',
  styleUrl: './system-user-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserListPageComponent {

  private _fb = inject(FormBuilder);
  private _systemUserHttpS = inject(SystemUserHttpService);

  list = new List<SystemUser>({
    persistOnUrl: true,
    request: {
      send: (): any => {
        const filters: any = {
          'filters.status_id|in': this.list.filters.getValue('main.statuses').join(','),
          'filters.email|-like-': this.list.filters.getValue('main.email'),
          'filters.created_at|betweenDates': betweenDatesMapper(this.list.filters.getValue('main.createdAt'), true),
          'advFilters._groupA:or.email_verified_at|!null': this.list.filters.getValue('main.emailVerified'),
          'advFilters._groupA:or.email_verified_at|null': this.list.filters.getValue('main.emailNotVerified'),
        };

        for (const [i, value] of (this.list.filters.getValue('main.name')?.split(' ') || []).entries()) {
          filters[`advFilters._groupB${i}:or.first_name|-like-`] = value;
          filters[`advFilters._groupB${i}:or.last_name|-like-`] = value;
        }

        const params = {
          page: this.list.currentPage(),
          limit: this.list.limit(),
          sort: this.list.sort() || '-created_at',
          with: 'status',
          ...stringToObjectParser(filters, true),
        };

        return this._systemUserHttpS.getList(params);
      },
      watch: 'system_users',
    },
    filters: new Form(this._fb.group({
      main: this._fb.group({
        statuses: this._fb.control([]),
        name: this._fb.control(''),
        email: this._fb.control(''),
        createdAt: this._fb.control([]),
        emailVerified: this._fb.control(false),
        emailNotVerified: this._fb.control(false),
      }),
    }), {
      combos: `auth_statuses`,
    }),
  });

  constructor() {
    //
  }
}
