import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiState } from '../../../states/ui.state';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RouteService } from '../../../core/services/route.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewportService } from '../../../core/services/viewport.service';

@Component({
  selector: 'app-sider',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzMenuModule,
    NzToolTipModule,
    NzIconModule,
  ],
  templateUrl: './sider.component.html',
  styleUrl: './sider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiderComponent {

  private _viewportS = inject(ViewportService);
  authS = inject(AuthService);
  routeS = inject(RouteService);
  uiState = inject(UiState);

  constructor() {
    this.routeS.onNavigationStart$().pipe(
      takeUntilDestroyed(),
    ).subscribe(() => {
      if (this._viewportS.down('sm')) {
        this.uiState.sidebar.isVisible.value.set(false);
      }
    });
  }
}
