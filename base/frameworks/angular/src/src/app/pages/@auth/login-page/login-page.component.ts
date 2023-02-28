import { SocialAuthService, SocialLoginModule } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { filter, skip } from 'rxjs';
import { SvgHoggaxLogoComponent } from 'src/app/components/svg/svg.components';
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/shared.module';
import { SubscriptionHandler } from 'src/app/utils/handlers/subscription-handler';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    SocialLoginModule,
    SvgHoggaxLogoComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export default class LoginPageComponent implements OnInit, OnDestroy {

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    public authS: AuthService,
    private _socialAuthService: SocialAuthService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._sh.add(
      this._socialAuthService.authState.pipe(
        skip(1),
        filter(socialUser => !!socialUser)
      ).subscribe(socialUser => {
        this.authS.login({ data: socialUser });

        this._router.navigateByUrl(this._route.snapshot.queryParamMap.get('redirectTo') || '/', {
          replaceUrl: true,
        });
      })
    );
  }

  ngOnDestroy(): void {
    this._sh.clean();
  }
}
