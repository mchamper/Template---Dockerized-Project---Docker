import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavService } from 'src/app/services/nav.service';
import { NzResultModule } from 'ng-zorro-antd/result';
import { SharedModule } from 'src/app/shared.module';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [
    SharedModule,
    NzResultModule,
  ],
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {

  constructor(
    public navS: NavService,
  ) { }
}
