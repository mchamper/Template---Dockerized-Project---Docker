import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-form-item',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.scss']
})
export class FormItemComponent implements OnInit {

  @Input() controlName: string = '';

  constructor(
    public formGroup: FormGroupDirective,
  ) { }

  ngOnInit(): void {
  }

  get hasValue(): boolean {
    const value = this.formGroup.form.get(this.controlName)?.value;

    return value === 0 || !!value;
  }

}
