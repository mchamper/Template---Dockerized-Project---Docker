import { Component, EventEmitter, Injector, Input, Output, inject } from '@angular/core';
import { isArray } from 'lodash';
import { Request } from '../../features/request/request.class';

type TSuccessEvent<ActionName = any> = {
  action: ActionName,
  data?: any,
}

type Action<ActionName = any> = {
  name: ActionName,
  can: () => boolean,
}

@Component({
  template: '',
})
export class AbstractActionGroupComponent<ActionName = any, Layout = 'icon' | 'button' | 'link' | 'menu'> {

  protected _injector = inject(Injector);

  @Input({ required: true }) layout!: Layout;
  @Input() only: ActionName | ActionName[] = [];
  @Input() except: ActionName | ActionName[] = [];
  @Input() request = new Request();
  @Output() onSuccess$: EventEmitter<TSuccessEvent<ActionName>> = new EventEmitter();

  actions: Action<ActionName>[] = [];

  /* -------------------- */

  get(actionName: ActionName): Action {
    return this.actions.find(item => item.name === actionName)!;
  }

  canShow(actionName: ActionName): boolean {
    const canShow = () => {
      if (!isArray(this.only)) this.only = [this.only];
      if (!isArray(this.except)) this.except = [this.except];

      if (!this.only.length && !this.except.length) {
        return true;
      }

      return this.only.length
        ? this.only.some(item => item === actionName)
        : !this.except.some(item => item === actionName);
    }

    return canShow() && this.get(actionName).can();
  }

  /* -------------------- */

  canShowAnyAction(): boolean {
    return this.actions.some(action => action.can());
  }

  canShowAllActions(): boolean {
    return this.actions.every(action => action.can());
  }
}
