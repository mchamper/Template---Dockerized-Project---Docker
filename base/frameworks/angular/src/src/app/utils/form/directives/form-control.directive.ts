import { Directive, ElementRef, Input, Optional } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgControl } from '@angular/forms';
import { isArray } from 'lodash';
import { SubscriptionHandler } from '../../handlers/subscription-handler';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzDatePickerComponent, NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { BehaviorSubject } from 'rxjs';
import { NzFormControlComponent } from 'ng-zorro-antd/form';
import { formValidatorMessages } from '../form-validators';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzUploadComponent } from 'ng-zorro-antd/upload';

@Directive({
  selector: '[formControl],[formControlName],[ngModel],nz-upload',
  standalone: true
})
export class FormControlDirective {

  @Input() uploadControl!: FormControl;
  @Input() errorMessages!: { [key: string]: string };

  formItemElem!: HTMLElement | null;
  formItemLabelElem!: HTMLElement | null;

  isFocused$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _sh: SubscriptionHandler = new SubscriptionHandler();

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

  ngOnDestroy(): void {
    this._sh.clean();
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
      this._host.nativeElement.onfocus = () => this.isFocused$.next(true);
      this._host.nativeElement.onblur = () => this.isFocused$.next(false);
    }
  }

  resolveFocusOnNzInputNumberControl(): void {
    if (this._nzInputNumberControl) {
      const inputElem = this._host.nativeElement.querySelector<HTMLInputElement>('.ant-input-number-input');

      if (inputElem) {
        inputElem.onfocus = () => this.isFocused$.next(true);
        inputElem.onblur = () => this.isFocused$.next(false);
      }
    }
  }

  resolveFocusOnNzSelectControl(): void {
    if (this._nzSelectControl) {
      this._sh.add(
        this._nzSelectControl.nzOpenChange.subscribe(isOpened => this.isFocused$.next(isOpened))
      );
    }
  }

  resolveFocusOnNzDatePickerControl(): void {
    if (this._nzDatePickerControl) {
      this._sh.add(
        this._nzDatePickerControl.nzOnOpenChange.subscribe(isOpened => this.isFocused$.next(isOpened))
      );
    }
  }

  /* -------------------- */

  resolveFloatingLabel(): void {
    this.resolveFloatingLabelOnFocus();
    this.resolveFloatingLabelOnValueChanges();
  }

  resolveFloatingLabelOnFocus(): void {
    this._sh.add(
      this.isFocused$.subscribe(isFocused => {
        this.markLabelAsFloating(!isFocused, this.controlValue);
      })
    );
  }

  resolveFloatingLabelOnValueChanges(subscribe: boolean = true): void {
    const onValueChange = () => {
      this.markLabelAsFloating(true, this.controlValue);
    };

    onValueChange();
    this._sh.add(this.control?.valueChanges?.subscribe(() => onValueChange()));
  }

  /* -------------------- */

  markLabelAsFloating(mustMark: boolean, value?: any): void {
    mustMark = mustMark
      && !this.hasValue(value)
      && !this.isFocused$.value
      ;

    if (this.formItemLabelElem) {
      this.formItemLabelElem.classList.remove('floating');
      if (mustMark) this.formItemLabelElem.classList.add('floating');
    }
  }

  /* -------------------- */

  resolveErrors(subscribe: boolean = true): void {
    if (!subscribe) {
      if (this._nzFormControl) {
        this._nzFormControl.nzErrorTip = undefined;

        if (this.control?.status === 'INVALID') {
          this.setErrors();
          this._nzFormControl.nzErrorTip = this.control?.getError('error');
        }
      }

      return;
    }

    this.resolveErrors(false);

    this._sh.add(
      this.control?.statusChanges?.subscribe(value => {
        this.resolveErrors(false);
      })
    );
  }

  setErrors(): void {
    if (this.control.getError('error')) {
      return;
    }

    const formControl = this.uploadControl || this._formGroup.form.get(this._control.path || '');

    if (formControl) {
      formControl.setErrors({ error: this.getLocalErrorMessage() }, {
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

        return message;
      }
    }

    return '';
  }
}
