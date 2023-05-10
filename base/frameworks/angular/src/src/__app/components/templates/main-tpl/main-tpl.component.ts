import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../layouts/navbar/navbar.component';
import { SidebarComponent } from '../../layouts/sidebar/sidebar.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    NzIconModule,
  ],
  templateUrl: './main-tpl.component.html',
  styleUrls: ['./main-tpl.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainTplComponent implements OnInit {

  sidebarVisible: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
