import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupComponent implements OnInit {

  @Input('formGroup') group!: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }
}
