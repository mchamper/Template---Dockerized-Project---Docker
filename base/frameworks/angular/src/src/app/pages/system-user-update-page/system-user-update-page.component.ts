import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector, inject } from '@angular/core';
import { FormModule } from '../../core/features/form/form.module';
import { PageTitleComponent } from '../../core/components/layouts/page-title/page-title.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { SystemUserHttpService } from '../../services/http/system-user-http.service';
import { Form } from '../../core/features/form/form.class';
import { List } from '../../core/features/list/list.class';
import { ListModule } from '../../core/features/list/list.module';

@Component({
  selector: 'app-system-user-update-page',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    ListModule,
    PageTitleComponent,
  ],
  templateUrl: './system-user-update-page.component.html',
  styleUrl: './system-user-update-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserUpdatePageComponent {

  private _fb = inject(FormBuilder);
  private _route = inject(ActivatedRoute);
  private _systemUserHttpS = inject(SystemUserHttpService);

  systemUserId = Number(this._route.snapshot.params['systemUserId']);
  form: Form;

  constructor() {
    this.form = new Form(this._fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password_current: [null],
      password: [null],
      password_confirmation: [null],
    }), {
      init: (form) => {
        form.getControl('email').disable();
      },
      dataRequest: {
        send: () => this._systemUserHttpS.getOne(this.systemUserId, { with: '' }),
        watch: 'system_user',
        success: (res) => this.form.set(res.body._raw.system_user),
      },
      request: {
        send: () => this._systemUserHttpS.update(this.systemUserId, this.form.group.value),
        success: (res) => this.form.persist({ ...res.body._raw.system_user, password_current: null, password: null, password_confirmation: null }),
        notify: true,
      },
    });
  }
}
