import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SystemUserHttpService } from 'src/app/services/http/system-user-http.service';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/form.module';
import { Form } from 'src/app/utils/form/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Router, RouterModule } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { systemUserCreateFormMock } from 'src/app/mocks/system-user-create-form.mock';
import { escape } from 'lodash';
import { SectionTitleComponent } from 'src/app/components/layouts/section-title/section-title/section-title.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormSectionTitleComponent } from 'src/app/components/layouts/form-section-title/form-section-title.component';
import { AuthService } from 'src/app/services/auth.service';
import { FormFooterComponent } from 'src/app/components/layouts/form-footer/form-footer.component';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-system-user-create-page',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestComponent,
    NzDividerModule,
    SectionTitleComponent,
    NzBreadCrumbModule,
    RouterModule,
    NzIconModule,
    FormSectionTitleComponent,
    FormFooterComponent,
  ],
  templateUrl: './system-user-create-page.component.html',
  styleUrls: ['./system-user-create-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SystemUserCreatePageComponent {

  form: Form;

  constructor(
    public authS: AuthService,
    private _systemUserHttpS: SystemUserHttpService,
    private _nzNotificationS: NzNotificationService,
    private _fb: FormBuilder,
    private _router: Router,
  ) {

    this.form = new Form(this._fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password_input_type: ['random', Validators.required],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    }), {
      mock: systemUserCreateFormMock(),
      onInitSubscriptions: (form) => {
        form.group.get('password_input_type')?.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
          if (value === 'random') {
            form.group.get('password')?.setValue('');
            form.group.get('password')?.disable();
            form.group.get('password_confirmation')?.setValue('');
            form.group.get('password_confirmation')?.disable();
          } else {
            form.group.get('password')?.enable();
            form.group.get('password_confirmation')?.enable();
          }
        });
      },
      combos: `channels_for_system_user_client_assignment`,
      request: {
        send: () => this._systemUserHttpS.create({ ...this.form.group.value }),
        success: (res) => {
          this._nzNotificationS.success(
            `<strong>Usuario creado</strong>`,
            res.body.system_user_password
              ? `
                <p class="mb-2">El usuario se ha creado con éxito.</p>
                <p class="mb-2">Se ha generado una contraseña aleatoria que se mostrará a continuación por única vez:<br><code>${escape(res.body.system_user_password)}</code></p>
                <p class="mb-0">También se le ha enviado un email de verificación a la dirección de correo ingresada.</p>
              `
              : `
                <p class="mb-2">El usuario se ha creado con éxito.</p>
                <p class="mb-0">Se le ha enviado un email de verificación a la dirección de correo ingresada.</p>
              `,
            {
              nzDuration: 5000,
            }
          );

          this._router.navigate(['/usuarios']);
        }
      },
    });
  }
}
