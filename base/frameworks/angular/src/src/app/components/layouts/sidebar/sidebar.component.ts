import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ViewportService } from 'src/app/services/viewport.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    NzMenuModule,
    NzIconModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  constructor(
    public viewportS: ViewportService,
  ) { }
}
