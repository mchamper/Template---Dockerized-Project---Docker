import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { RouterModule } from '@angular/router';
import { SvgTriviasFunLogoComponent, SvgTriviasFunShortLogoComponent } from '../../svg/svg.components';
import { RouteService } from 'src/app/services/route.service';
import { AuthService } from 'src/app/services/auth.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { SearchbarComponent } from '../../commons/searchbar/searchbar.component';
import { SidebarOffcanvasComponent } from '../../offcanvas/sidebar-offcanvas/sidebar-offcanvas.component';
import { SearchbarOffcanvasComponent } from '../../offcanvas/searchbar-offcanvas/searchbar-offcanvas.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    SvgTriviasFunLogoComponent,
    SvgTriviasFunShortLogoComponent,
    NzDropDownModule,
    NzIconModule,
    SearchbarComponent,
    SidebarOffcanvasComponent,
    SearchbarOffcanvasComponent,
    NzAvatarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {

  constructor(
    public routeS: RouteService,
    public authS: AuthService,
  ) { }

  ngOnInit(): void {
  }
}
