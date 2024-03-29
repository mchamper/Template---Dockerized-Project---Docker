import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiState } from '../../../states/ui.state';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RouteService } from '../../../core/services/route.service';

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

  authS = inject(AuthService);
  routeS = inject(RouteService);
  uiState = inject(UiState);
}
