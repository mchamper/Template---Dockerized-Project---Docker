import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from '../../core/features/form/form.module';
import { Form } from '../../core/features/form/form.class';
import { AuthService } from '../../services/auth.service';
import { SystemUserHttpService } from '../../services/http/system-user-http.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, Validators } from '@angular/forms';
import { systemUserCreateFormMock } from '../../mocks/system-user-create-form.mock';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../components/layouts/page-title/page-title.component';
import { escape } from 'lodash';
import { BoxSectionTitleComponent } from '../../components/layouts/box-section-title/box-section-title.component';

@Component({
  selector: 'app-system-user-create-page',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    PageTitleComponent,
    BoxSectionTitleComponent,
  ],
  templateUrl: './system-user-create-page.component.html',
  styleUrl: './system-user-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserCreatePageComponent {

  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _nzNotificationS = inject(NzNotificationService);
  private _systemUserHttpS = inject(SystemUserHttpService);
  authS = inject(AuthService);

  form: Form;

  constructor() {
    this.form = new Form(this._fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password_input_type: ['random', Validators.required],
      password: [null, [Validators.required]],
      password_confirmation: [null, [Validators.required]],
      require_email_verification: [false, [Validators.required]],
    }), {
      mock: systemUserCreateFormMock(),
      subscriptions: (form) => {
        form.changes('password_input_type').subscribe(value => {
          if (value === 'random') {
            form.getControl('password')?.setValue('');
            form.getControl('password')?.disable();
            form.getControl('password_confirmation')?.setValue('');
            form.getControl('password_confirmation')?.disable();
          } else {
            form.getControl('password')?.enable();
            form.getControl('password_confirmation')?.enable();
          }

          form.getControl('password').updateValueAndValidity();
          form.getControl('password_confirmation').updateValueAndValidity();
        });
      },
      request: {
        send: () => this._systemUserHttpS.create({ ...this.form.group.value }),
        success: (res) => {
          this._nzNotificationS.success(
            `<strong>Usuario creado</strong>`,
            res.body.system_user_password
              ? `
                <p class="mb-2">El usuario se ha creado con éxito.</p>
                <p class="mb-2">Se ha generado una contraseña aleatoria que se mostrará a continuación por única vez:<br><code>${escape(res.body.system_user_password)}</code></p>
                ${
                  this.form.getValue('require_email_verification')
                    ? '<p class="mb-0">También se le ha enviado un email de verificación a la dirección de correo ingresada.</p>'
                    : ''
                }
              `
              : `
                <p class="mb-2">El usuario se ha creado con éxito.</p>
                ${
                  this.form.getValue('require_email_verification')
                    ? '<p class="mb-0">Se le ha enviado un email de verificación a la dirección de correo ingresada.</p>'
                    : ''
                }
              `
              ,
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
