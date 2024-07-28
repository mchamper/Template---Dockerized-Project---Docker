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
import { createDefaultForm } from '../../core/features/v1/form/factory';

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

  form = new Form(this._fb.group({
    first_name: this._fb.control('', { validators: [Validators.required] }),
    last_name: this._fb.control('', { validators: [Validators.required] }),
    email: this._fb.control('', { validators: [Validators.required, Validators.email] }),
    password_input_type: this._fb.control<'random' | 'manual'>('random', { validators: [Validators.required] }),
    password: this._fb.control('', { validators: [Validators.required] }),
    password_confirmation: this._fb.control('', { validators: [Validators.required] }),
    require_email_verification: this._fb.control(false, { validators: [Validators.required] }),
  }), {
    mock: systemUserCreateFormMock(),
    subscriptions: (form) => {
      form.changes('password_input_type').subscribe(value => {
        if (value === 'random') {
          form.group.controls.password.setValue('');
          form.group.controls.password.disable();
          form.group.controls.password_confirmation.setValue('');
          form.group.controls.password_confirmation.disable();
        } else {
          form.group.controls.password.enable();
          form.group.controls.password_confirmation.enable();
        }

        form.group.controls.password.updateValueAndValidity();
        form.group.controls.password_confirmation.updateValueAndValidity();
      });
    },
    request: {
      send: (): any => this._systemUserHttpS.create(this.form.group.value),
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

  exampleForm = createDefaultForm();

  constructor() {
    // this.exampleForm.dataRequest?.body
  }
}
