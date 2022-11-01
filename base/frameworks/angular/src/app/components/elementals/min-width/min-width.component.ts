import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

@Component({
  selector: 'app-min-width',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './min-width.component.html',
  styleUrls: ['./min-width.component.scss']
})
export class MinWidthComponent implements OnInit {

  @Input() value!: number;
  @Input() translate: string = '-50%';

  constructor() { }

  ngOnInit(): void {
  }

}
