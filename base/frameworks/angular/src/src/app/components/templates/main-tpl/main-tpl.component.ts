import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../layouts/navbar/navbar.component';
import { SiderComponent } from '../../layouts/sider/sider.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { FixedComponent } from '../../../core/components/functionals/fixed/fixed.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UiState } from '../../../states/ui.state';

@Component({
  selector: 'app-main-tpl',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SiderComponent,
    FooterComponent,
    FixedComponent,
    NzIconModule,
  ],
  templateUrl: './main-tpl.component.html',
  styleUrl: './main-tpl.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainTplComponent {

  uiState = inject(UiState);
}
