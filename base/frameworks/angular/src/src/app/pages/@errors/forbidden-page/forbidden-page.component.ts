import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavService } from 'src/app/services/nav.service';
import { NzResultModule } from 'ng-zorro-antd/result';
import { SharedModule } from 'src/app/shared.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    NzResultModule,
    NzButtonModule
  ],
  templateUrl: './forbidden-page.component.html',
  styleUrls: ['./forbidden-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForbiddenPageComponent {

  constructor(
    public navS: NavService,
  ) { }
}
