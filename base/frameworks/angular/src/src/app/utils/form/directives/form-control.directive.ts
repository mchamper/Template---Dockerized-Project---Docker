import { DestroyRef, Directive, ElementRef, Injector, Input, Optional, inject, signal } from '@angular/core';
import { FormControl, FormControlStatus, FormGroupDirective, NgControl } from '@angular/forms';
import { isArray } from 'lodash';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzDatePickerComponent, NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { Observable } from 'rxjs';
import { NzFormControlComponent } from 'ng-zorro-antd/form';
import { formValidatorMessages } from '../form-validators';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzUploadComponent } from 'ng-zorro-antd/upload';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[formControl],[formControlName],[ngModel],nz-upload',
  standalone: true
})
export class FormControlDirective {

  @Input() uploadControl!: FormControl;
  @Input() errorMessages!: { [key: string]: string };

  formItemElem!: HTMLElement | null;
  formItemLabelElem!: HTMLElement | null;

  isFocused = signal<boolean>(false);

  private _injector = inject(Injector);
  private _destroyRef = inject(DestroyRef);

  constructor(
    private _host: ElementRef<HTMLElement>,
    @Optional() private _control: NgControl,
    @Optional() private _formGroup: FormGroupDirective,
    @Optional() private _nzInputControl: NzInputDirective,
    @Optional() private _nzInputGroupControl: NzInputGroupComponent,
    @Optional() private _nzInputNumberControl: NzInputNumberComponent,
    @Optional() private _nzSelectControl: NzSelectComponent,
    @Optional() private _nzDatePickerControl: NzDatePickerComponent,
    @Optional() private _nzRangePickerControl: NzRangePickerComponent,
    @Optional() private _nzUploadControl: NzUploadComponent,
    @Optional() private _nzFormControl: NzFormControlComponent,
  ) { }

  ngOnInit(): void {
    this.resolveItems();

    this.resolveFocus();
    this.resolveFloatingLabel();

    this.resolveErrors();
  }

  get control(): NgControl | FormControl {
    return this._control || this.uploadControl;
  }

  get controlValue(): NgControl | FormControl {
    return this.control.value;
  }

  /* -------------------- */

  hasValue(value: any): boolean {
    return isArray(value)
      ? !!value.length
      : value === 0 || !!value;
  }

  /* -------------------- */

  resolveItems(): void {
    this.formItemElem = this._host.nativeElement.closest('nz-form-item');

    if (this.formItemElem) {
      this.formItemLabelElem = this.formItemElem.querySelector('nz-form-label');
    }

    if (this._nzInputControl && this._nzInputGroupControl) {
      this._host.nativeElement.classList.add('input-in-group');
    }

    if (this._nzUploadControl) {
      this.formItemElem?.classList.add('no-floating');

      if (this._host.nativeElement.classList.contains('dropzone')) {
        const uploadElem = this._host.nativeElement.querySelector('.ant-upload');

        if (uploadElem) {
          uploadElem.classList.add('ant-upload-select-picture-card');
        }
      }
    }
  }

  /* -------------------- */

  resolveFocus(): void {
    this.resolveFocusOnNzInputControl();
    this.resolveFocusOnNzInputNumberControl();
    this.resolveFocusOnNzSelectControl();
    this.resolveFocusOnNzDatePickerControl();
  }

  resolveFocusOnNzInputControl(): void {
    if (this._nzInputControl) {
      this._host.nativeElement.onfocus = () => this.isFocused.set(true);
      this._host.nativeElement.onblur = () => this.isFocused.set(false);
    }
  }

  resolveFocusOnNzInputNumberControl(): void {
    if (this._nzInputNumberControl) {
      const inputElem = this._host.nativeElement.querySelector<HTMLInputElement>('.ant-input-number-input');

      if (inputElem) {
        inputElem.onfocus = () => this.isFocused.set(true);
        inputElem.onblur = () => this.isFocused.set(false);
      }
    }
  }

  resolveFocusOnNzSelectControl(): void {
    if (this._nzSelectControl) {
      this._nzSelectControl.nzOpenChange.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(isOpened => this.isFocused.set(isOpened));
    }
  }

  resolveFocusOnNzDatePickerControl(): void {
    if (this._nzDatePickerControl) {
      this._nzDatePickerControl.nzOnOpenChange.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(isOpened => this.isFocused.set(isOpened));
    }
  }

  /* -------------------- */

  resolveFloatingLabel(): void {
    this.resolveFloatingLabelOnFocus();
    this.resolveFloatingLabelOnValueChanges();
  }

  resolveFloatingLabelOnFocus(): void {
    toObservable(this.isFocused, { injector: this._injector}).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(isFocused => {
      this.markLabelAsFloating(!isFocused, this.controlValue);
    });
  }

  resolveFloatingLabelOnValueChanges(): void {
    const onValueChange = () => {
      this.markLabelAsFloating(true, this.controlValue);
    };

    onValueChange();
    this.control?.valueChanges?.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => onValueChange());
  }

  /* -------------------- */

  markLabelAsFloating(mustMark: boolean, value?: any): void {
    mustMark = mustMark
      && !this.hasValue(value)
      && !this.isFocused()
      ;

    if (this.formItemLabelElem) {
      this.formItemLabelElem.classList.remove('floating');
      if (mustMark) this.formItemLabelElem.classList.add('floating');
    }
  }

  /* -------------------- */

  resolveErrors(): void {
    const onStatusChange = () => {
      if (this._nzFormControl) {
        this._nzFormControl.nzErrorTip = undefined;

        if (this.control?.status === 'INVALID') {
          this.setErrors();
          this._nzFormControl.nzErrorTip = this.control?.getError('localError') || this.control?.getError('apiError');
        }
      }
    };

    onStatusChange();
    (this.control?.statusChanges as Observable<FormControlStatus>).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => onStatusChange());
  }

  setErrors(): void {
    if (this.control.getError('localError') || this.control.getError('apiError')) {
      return;
    }

    const formControl = this.uploadControl || this._formGroup.form.get(this._control.path || '');

    if (formControl) {
      formControl.setErrors({ localError: this.getLocalErrorMessage() }, {
        emitEvent: false
      });
    }
  }

  getLocalErrorMessage(): string {
    for (const key in this.control.errors) {
      if (this.errorMessages && this.errorMessages[key]) {
        return this.errorMessages[key];
      }

      if (formValidatorMessages[key]) {
        const message: any = formValidatorMessages[key];

        if (key === 'mask') {
          const mask = this.control.errors[key].requiredMask;
          return message(mask);
        }

        if (key === 'maxlength') {
          const maxLength = this.control.errors[key].requiredLength;
          return message(maxLength);
        }

        if (key === 'max') {
          const max = this.control.errors[key].max;
          return message(max);
        }

        return message;
      }
    }

    return '';
  }
}
