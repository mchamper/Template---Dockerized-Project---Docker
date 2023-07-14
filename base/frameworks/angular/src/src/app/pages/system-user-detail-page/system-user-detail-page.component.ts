import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AuthService } from 'src/app/services/auth.service';
import { SystemUserHttpService } from 'src/app/services/http/system-user-http.service';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { Form } from 'src/app/utils/form/form';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { SystemUserActionComponent, SystemUserActionSuccessEvent } from 'src/app/components/core/system-user/system-user-action/system-user-action.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SectionTitleComponent } from 'src/app/components/layouts/section-title/section-title/section-title.component';
import { FormSectionTitleComponent } from 'src/app/components/layouts/form-section-title/form-section-title.component';
import { UploadHttpService } from 'src/app/services/http/upload-http.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormFooterComponent } from 'src/app/components/layouts/form-footer/form-footer.component';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';
import { stringToObject } from 'src/app/helper';
import { SystemUser } from 'src/app/commons/models/system-user';

@Component({
  selector: 'app-system-user-detail-page',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestComponent,
    NzDividerModule,
    SectionTitleComponent,
    NzBreadCrumbModule,
    RouterModule,
    SystemUserActionComponent,
    NzTagModule,
    NzIconModule,
    FormSectionTitleComponent,
    FormFooterComponent,
  ],
  templateUrl: './system-user-detail-page.component.html',
  styleUrls: ['./system-user-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SystemUserDetailPageComponent {

  form: Form<SystemUser>;
  systemUserId: number = parseInt(this._route.snapshot.paramMap.get('systemUserId') || '');

  constructor(
    public router: Router,
    public uploadHttpS: UploadHttpService,
    private _authS: AuthService,
    private _route: ActivatedRoute,
    private _systemUserHttpS: SystemUserHttpService,
    private _fb: FormBuilder,
  ) {

    this.form = new Form(this._fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      created_at: [''],
      updated_at: [''],
      picture: [null],
      photos: [null],
    }), {
      onInit: (form) => {
        form.group.get('email')?.disable();
        form.group.get('created_at')?.disable();
        form.group.get('updated_at')?.disable();
      },
      combos: `channels_for_system_user_client_assignment:${this.systemUserId}`,
      dataRequest: {
        send: () => {
          const filters = {
            'filters.id|!eq': this._authS.systemUser().data()?.id,
          };

          const params = {
            with: 'channel,channels',
            ...stringToObject(filters, true),
          };

          return this._systemUserHttpS.getOne(this.systemUserId, params);
        },
        body: 'system_user',
        success: () => {
          this.form.set(this.form.dataRequest.body()?.raw);
        },
      },
      request: {
        send: () => this._systemUserHttpS.update(this.systemUserId, { ...this.form.group.value }),
        body: 'system_user',
        success: () => {
          this.form.persist(this.form.request.body()?.raw);
        },
      }
    });
  }

  /* -------------------- */

  onActionSuccess(event: SystemUserActionSuccessEvent) {
    switch (event.action) {
      case 'activate':
      case 'deactivate': {
        this.form.dataRequest.setBody(event.data);
        break;
      }

      case 'delete': {
        this.router.navigate(['/usuarios']);
        break;
      }

      default: {
        this.form.dataRequest.run();
        break;
      }
    }
  }
}
