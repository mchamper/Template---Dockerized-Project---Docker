import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-form-item',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormItemComponent implements OnInit {

  @Input() controlName: string = '';

  control!: AbstractControl | null;

  constructor(
    public parentGroup: FormGroupDirective,
  ) { }

  ngOnInit(): void {
    this.control = this.parentGroup.control.get(this.controlName);
  }

  hasValue(value: any): boolean {
    return value === 0 || !!value;
  }

}
