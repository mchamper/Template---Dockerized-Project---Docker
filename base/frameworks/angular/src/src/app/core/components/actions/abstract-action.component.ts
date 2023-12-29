import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, signal } from '@angular/core';
import { THttpResponse } from '../../types/http-response.type';

@Component({
  template: '',
})
export abstract class AbstractActionComponent<Layout = 'modal' | 'popover'> {

  @ViewChild('popoverTpl') popoverTpl!: TemplateRef<void>;
  @ViewChild('modalTpl') modalTpl!: TemplateRef<void>;

  @Input({ required: true }) layout!: Layout;
  @Output() onSuccess$: EventEmitter<THttpResponse> = new EventEmitter();

  popover = {
    isVisible: signal(false),
    open: () => { this.onInit(); this.popover.isVisible.set(true); },
    close: () => { this.popover.isVisible.set(false), this.onClose(); },
  };

  modal = {
    width: 500,
    isVisible: signal(false),
    open: () => { this.onInit(); this.modal.isVisible.set(true) },
    close: () => { this.modal.isVisible.set(false); this.onClose(); },
  };

  abstract onInit(): void;
  abstract onClose(): void;

  /* -------------------- */

  close() {
    switch (this.layout) {
      case 'modal': this.modal.close(); break;
      case 'popover': this.popover.close(); break;
    }
  }
}
