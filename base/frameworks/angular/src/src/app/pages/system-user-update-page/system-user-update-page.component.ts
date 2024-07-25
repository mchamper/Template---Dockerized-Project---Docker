import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormModule } from '../../core/features/form/form.module';
import { PageTitleComponent } from '../../components/layouts/page-title/page-title.component';
import { FormBuilder, Validators } from '@angular/forms';
import { SystemUserHttpService } from '../../services/http/system-user-http.service';
import { Form } from '../../core/features/form/form.class';
import { ListModule } from '../../core/features/list/list.module';
import { BoxSectionTitleComponent } from '../../components/layouts/box-section-title/box-section-title.component';
import { injectParams } from 'ngxtension/inject-params';

@Component({
  selector: 'app-system-user-update-page',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    ListModule,
    PageTitleComponent,
    BoxSectionTitleComponent,
  ],
  templateUrl: './system-user-update-page.component.html',
  styleUrl: './system-user-update-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserUpdatePageComponent {

  private _fb = inject(FormBuilder);
  private _systemUserHttpS = inject(SystemUserHttpService);

  systemUserId = injectParams('systemUserId');

  form = new Form(this._fb.group({
    first_name: this._fb.control('', { validators: [Validators.required] }),
    last_name: this._fb.control('', { validators: [Validators.required] }),
    email: this._fb.control('', { validators: [Validators.required] }),
    password_current: this._fb.control(''),
    password: this._fb.control(''),
    password_confirmation: this._fb.control(''),
  }), {
    init: (form) => {
      form.group.controls.email.disable();
    },
    dataRequest: {
      send: (): any => this._systemUserHttpS.getOne(Number(this.systemUserId()), { with: '' }),
      watch: 'system_user',
      success: (res) => this.form.set(res.body._raw.system_user),
    },
    request: {
      send: (): any => this._systemUserHttpS.update(Number(this.systemUserId()), this.form.group.value),
      success: (res) => this.form.persist({ ...res.body._raw.system_user, password_current: null, password: null, password_confirmation: null }),
      notify: true,
    },
  });;

  constructor() {
    //
  }
}
