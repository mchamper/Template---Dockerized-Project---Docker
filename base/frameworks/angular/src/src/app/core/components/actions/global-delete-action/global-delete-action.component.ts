import { ChangeDetectionStrategy, Component, Injector, Input, inject } from '@angular/core';
import { AbstractActionComponent } from '../abstract-action.component';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Form } from '../../../features/form/form.class';
import { FormModule } from '../../../features/form/form.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-global-delete-action',
  standalone: true,
  imports: [
    CommonModule,
    FormModule,
    NzAlertModule,
    NzModalModule,
    NzPopoverModule,
  ],
  templateUrl: './global-delete-action.component.html',
  styleUrl: './global-delete-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalDeleteActionComponent extends AbstractActionComponent {

  private _fb = inject(FormBuilder);

  @Input({ required: true }) id!: number;
  @Input({ required: true }) httpFn!: (id: number) => any;
  @Input() modalTitle: string = 'Borrar registro';
  @Input() description: string = '';
  @Input() confirmText: string = 'eliminar';
  @Input() submitText: string = 'Borrar';

  form = new Form(this._fb.group({
    confirmText: this._fb.control(''),
  }), {
    request: {
      when: () => this.canDelete(),
      send: () => this.httpFn(this.id),
      success: () => {
        this.close();
        this.onSuccess$.emit();
      },
      notify: true,
    },
    reset: true,
  });

  override onInit(): void {
    this.form.restore();
  }

  override onClose(): void {
    this.form.cancelRequests();
  }

  /* -------------------- */

  canDelete(): boolean {
    return this.form.group.controls.confirmText.value === this.confirmText;
  }
}
