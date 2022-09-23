import { Component } from '@angular/core';
import { NavService } from 'src/app/services/nav.service';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-not-found-page',
  imports: [
    CommonModule,
    NzResultModule,
  ],
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent {

  constructor(
    public navS: NavService,
  ) { }
}
