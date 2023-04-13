import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SystemUserHttpService } from 'src/app/services/http/system-user-http.service';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/components/form.module';
import { Form } from 'src/app/utils/form/form';
import { RequestHandlerComponent } from 'src/app/utils/handlers/request-handler/components/request-handler/request-handler.component';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { systemUserCreateFormMock } from 'src/app/mocks/system-user-create-form.mock';
import { escape } from 'lodash';

@Component({
  selector: 'app-system-user-create-page',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestHandlerComponent,
    NzDividerModule
  ],
  templateUrl: './system-user-create-page.component.html',
  styleUrls: ['./system-user-create-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SystemUserCreatePageComponent implements OnInit, OnDestroy {

  form: Form;

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    private _systemUserHttpS: SystemUserHttpService,
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
      onInit(form) {
        form.group.get('password')?.disable();
        form.group.get('password_confirmation')?.disable();

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
    });
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._sh.clean();
  }

  /* -------------------- */

  create(): void {
    const input = {
      ...this.form.group.value,
    };

    this._sh.add(
      this.form.send(this._systemUserHttpS.create(input), {
        reset: true,
        success: (res, notify) => {
          notify.success(
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
        },
      })?.subscribe()
    );
  }
}
