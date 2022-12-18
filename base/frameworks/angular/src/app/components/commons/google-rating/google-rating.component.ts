import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

@Component({
  selector: 'app-google-rating',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './google-rating.component.html',
  styleUrls: ['./google-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleRatingComponent implements OnInit {

  @Input() size: 'md' | 'lg' = 'md';

  constructor() { }

  ngOnInit(): void {
  }

}
