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
import { PageTitleComponent } from '../../core/components/layouts/page-title/page-title.component';
import { escape } from 'lodash';

@Component({
  selector: 'app-system-user-create-page',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    PageTitleComponent,
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
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password_input_type: ['random', Validators.required],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    }), {
      mock: systemUserCreateFormMock(),
      subscriptions: (form) => {
        form.changes('password_input_type').subscribe(value => {
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
