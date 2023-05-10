import { List } from 'src/app/utils/list/list';
import { Form } from 'src/app/utils/form/form';
import { Directive, Input } from '@angular/core';

export type TActionSource<T = any> = Form | List<T>;

@Directive()
export abstract class AbstractActionComponent {

  @Input() list!: List;
  @Input() form: Form = new Form();
  @Input() type: 'buttons' | 'dropdown' = 'buttons';

  protected _getForm(): Form {
    return this.list
      ? this.list.action
      : this.form;
  }
}
