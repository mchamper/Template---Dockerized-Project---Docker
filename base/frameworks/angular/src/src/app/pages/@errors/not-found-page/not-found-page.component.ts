import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavService } from 'src/app/services/nav.service';
import { NzResultModule } from 'ng-zorro-antd/result';
import { SharedModule } from 'src/app/shared.module';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [
    SharedModule,
    NzResultModule,
    NzButtonModule
  ],
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundPageComponent {

  constructor(
    public navS: NavService,
  ) { }
}
