import { Directive, ElementRef, Input, Optional } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgControl } from '@angular/forms';
import { isArray } from 'lodash';
import { SubscriptionHandler } from '../../handlers/subscription-handler';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzDatePickerComponent, NzRangePickerComponent } from 'ng-zorro-antd/date-picker';
import { BehaviorSubject } from 'rxjs';
import { NzFormControlComponent } from 'ng-zorro-antd/form';
import { formValidatorMessages } from '../form-validators';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';

@Directive({
  selector: '[formControlName]',
  standalone: true
})
export class FormControlDirective {

  @Input() errorMessages!: { [key: string]: string };

  formItemElem!: HTMLElement | null;
  formItemLabelElem!: HTMLElement | null;

  isFocused$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _sh: SubscriptionHandler = new SubscriptionHandler();

  constructor(
    private _host: ElementRef<HTMLElement>,
    private _control: NgControl,
    @Optional() private _formGroup: FormGroupDirective,
    @Optional() private _nzInputControl: NzInputDirective,
    @Optional() private _nzInputNumberControl: NzInputNumberComponent,
    @Optional() private _nzSelectControl: NzSelectComponent,
    @Optional() private _nzDatePickerControl: NzDatePickerComponent,
    @Optional() private _nzRangePickerControl: NzRangePickerComponent,
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
        this.markLabelAsFloating(!isFocused, this._control.value);
      })
    );
  }

  resolveFloatingLabelOnValueChanges(subscribe: boolean = true): void {
    if (!subscribe) {
      this.markLabelAsFloating(true, this._control.value);
      return;
    }

    this.resolveFloatingLabelOnValueChanges(false);

    this._sh.add(
      this._control.valueChanges?.subscribe(value => {
        this.resolveFloatingLabelOnValueChanges(false);
      })
    );
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

        if (this._control.status === 'INVALID') {
          this.setErrors();
          this._nzFormControl.nzErrorTip = this._control.getError('error');
        }
      }

      return;
    }

    this.resolveErrors(false);

    this._sh.add(
      this._control.statusChanges?.subscribe(value => {
        this.resolveErrors(false);
      })
    );
  }

  setErrors(): void {
    if (this._control.getError('error')) {
      return;
    }

    const formControl = this._formGroup.form.get(this._control.path || '');

    if (formControl) {
      formControl.setErrors({ error: this.getLocalErrorMessage() }, {
        emitEvent: false
      });
    }
  }

  getLocalErrorMessage(): string {
    for (const key in this._control.errors) {
      if (this.errorMessages && this.errorMessages[key]) {
        return this.errorMessages[key];
      }

      if (formValidatorMessages[key]) {
        const message: any = formValidatorMessages[key];

        if (key === 'mask') {
          const mask = this._control.errors[key].requiredMask;
          return message(mask);
        }

        return message;
      }
    }

    return '';
  }
}
