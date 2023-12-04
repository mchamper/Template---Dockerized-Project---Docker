import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AuthService } from 'src/app/services/auth.service';
import { RouteService } from 'src/app/services/route.service';
import { SharedModule } from 'src/app/shared.module';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [
    SharedModule,
    NzAlertModule,
    RouterModule,
  ],
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForbiddenComponent {

  @ContentChild('content') contentTpl!: TemplateRef<any>;

  permissions = signal<string[]>([]);

  authS = inject(AuthService);
  routeS = inject(RouteService);

  constructor() {
    toObservable(this.routeS.currentPage).pipe(takeUntilDestroyed()).subscribe(value => {
      this.permissions.set(value.permissions || []);
    });
  }
}
