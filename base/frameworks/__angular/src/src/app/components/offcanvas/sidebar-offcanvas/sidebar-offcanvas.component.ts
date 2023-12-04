import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { SidebarComponent } from '../../layouts/sidebar/sidebar.component';
import { OffcanvasComponent } from '../offcanvas/offcanvas.component';

@Component({
  selector: 'app-sidebar-offcanvas',
  standalone: true,
  imports: [
    SharedModule,
    SidebarComponent,
    OffcanvasComponent,
  ],
  templateUrl: './sidebar-offcanvas.component.html',
  styleUrls: ['./sidebar-offcanvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarOffcanvasComponent {

}
