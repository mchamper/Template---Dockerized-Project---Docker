import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-min-width',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './min-width.component.html',
  styleUrls: ['./min-width.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinWidthComponent {

  @Input({ required: true }) value!: number;
  @Input() translate: string = '-50%';

}
