import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../core/components/layouts/page-title/page-title.component';
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

@Component({
  selector: 'app-system-user-list-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    ListModule,
    FormModule,
    RouterLink,
  ],
  templateUrl: './system-user-list-page.component.html',
  styleUrl: './system-user-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserListPageComponent {

  private _fb = inject(FormBuilder);

  private _systemUserHttpS = inject(SystemUserHttpService);

  list: List<SystemUser>;

  constructor() {
    this.list = new List({
      persistOnUrl: true,
      request: {
        send: () => {
          const filters: any = {
            'filters.status|in': this.list.filters.getValue('statuses').join(','),
            'filters.email|-like-': this.list.filters.getValue('email'),
            'filters.created_at|betweenDates': betweenDatesMapper(this.list.filters.getValue('createdAt'), true),
            'advFilters._groupA:or.email_verified_at|!null': this.list.filters.getValue('emailVerified'),
            'advFilters._groupA:or.email_verified_at|null': this.list.filters.getValue('emailNotVerified'),
          };

          for (const [i, value] of (this.list.filters.getValue('name').split(' ') || []).entries()) {
            filters[`advFilters._groupB${i}:or.first_name|-like-`] = value;
            filters[`advFilters._groupB${i}:or.last_name|-like-`] = value;
          }

          const params = {
            page: this.list.currentPage(),
            limit: this.list.limit(),
            sort: this.list.sort() || '-created_at',
            ...stringToObjectParser(filters, true),
          };

          return this._systemUserHttpS.getList(params);
        },
        watch: 'system_users',
      },
      filters: new Form(this._fb.group({
        statuses: [[]],
        name: [''],
        email: [''],
        createdAt: [[]],
        emailVerified: [false],
        emailNotVerified: [false],
      }), {
        combos: `system_user_statuses`,
      }),
    });
  }
}
