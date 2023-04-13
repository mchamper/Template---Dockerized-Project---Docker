import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { distinctUntilChanged } from 'rxjs';
import { stringToObject } from 'src/app/helper';
import { AuthService } from 'src/app/services/auth.service';
import { SystemUserHttpService } from 'src/app/services/http/system-user-http.service';
import { SharedModule } from 'src/app/shared.module';
import { FormModule } from 'src/app/utils/form/components/form.module';
import { Form } from 'src/app/utils/form/form';
import { RequestHandlerComponent } from 'src/app/utils/handlers/request-handler/components/request-handler/request-handler.component';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';

@Component({
  selector: 'app-system-user-detail-page',
  standalone: true,
  imports: [
    SharedModule,
    FormModule,
    RequestHandlerComponent,
    NzDividerModule
  ],
  templateUrl: './system-user-detail-page.component.html',
  styleUrls: ['./system-user-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SystemUserDetailPageComponent {

  form: Form;
  systemUserId: number = parseInt(this._route.snapshot.paramMap.get('systemUserId') || '');

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    private _authS: AuthService,
    private _route: ActivatedRoute,
    private _systemUserHttpS: SystemUserHttpService,
    private _fb: FormBuilder,
  ) {

    this.form = new Form(this._fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    }), {
      onInit(form) {
        form.group.get('email')?.disable();
      },
    });

    this.getOne();

  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._sh.clean();
  }

  /* -------------------- */

  getOne() {
    const filters: any = {
      'filters.id|!eq': this._authS.data('systemUser')?.id,
    };

    const params = {
      ...stringToObject(filters, true),
    };

    this._sh.add(
      this.form.send(this._systemUserHttpS.getOne(this.systemUserId, params), {
        request: 'data',
        success: (res) => {
          this.form.set(res.body.system_user);
        },
      })?.subscribe()
    , 'getOne');
  }

  /* -------------------- */

  update(): void {
    const input = {
      ...this.form.group.value,
    };

    this._sh.add(
      this.form.send(this._systemUserHttpS.update(this.systemUserId, input), {
        persist: true,
        notify: true,
      })?.subscribe()
    );
  }
}
