import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
