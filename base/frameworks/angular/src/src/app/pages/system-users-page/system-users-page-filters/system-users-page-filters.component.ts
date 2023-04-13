import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';
import SystemUsersPageComponent from '../system-users-page.component';
import { CombosHttpService } from 'src/app/services/http/combos-http.service';
import { FormBuilder } from '@angular/forms';
import { Form } from 'src/app/utils/form/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { RequestHandlerComponent } from 'src/app/utils/handlers/request-handler/components/request-handler/request-handler.component';
import { FormModule } from 'src/app/utils/form/components/form.module';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-system-users-page-filters',
  standalone: true,
  imports: [
    SharedModule,
    NzDividerModule,
    NzCollapseModule,
    NzIconModule,
    RequestHandlerComponent,
    FormModule,
  ],
  templateUrl: './system-users-page-filters.component.html',
  styleUrls: ['./system-users-page-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUsersPageFiltersComponent {

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    public parent: SystemUsersPageComponent,
    private _combosHttpS: CombosHttpService,
    private _fb: FormBuilder,
  ) {

    this.list.filters = new Form(this._fb.group({
      statuses: [[]],
      name: [''],
      email: [''],
      createdAt: [[]],
      emailVerified: [false],
      emailNotVerified: [false],
    }));

    this.getCombos();
  }

  get list() {
    return this.parent.list;
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
}
