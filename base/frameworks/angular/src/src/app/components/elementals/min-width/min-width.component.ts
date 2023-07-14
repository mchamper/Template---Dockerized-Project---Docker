import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

@Component({
  selector: 'app-min-width',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './min-width.component.html',
  styleUrls: ['./min-width.component.scss']
})
export class MinWidthComponent {

  @Input({ required: true }) value!: number;
  @Input() translate: string = '-50%';

}
