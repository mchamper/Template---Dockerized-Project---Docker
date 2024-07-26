import { Component, EventEmitter, Injector, Input, Output, TemplateRef, ViewChild, inject, signal } from '@angular/core';

@Component({
  template: '',
})
export abstract class AbstractActionComponent<Layout = 'page' | 'modal' | 'popover', Data = any> {

  @ViewChild('popoverTpl') popoverTpl!: TemplateRef<void>;
  @ViewChild('modalTpl') modalTpl!: TemplateRef<void>;

  @Input({ required: true }) layout!: Layout;
  @Input() disabled: boolean = false;

  @Output() onSuccess$: EventEmitter<Data> = new EventEmitter();

  protected _injector = inject(Injector);

  popover = {
    isVisible: signal(false),
    open: () => {
      if (!this.disabled) {
        this.onInit();
        this.popover.isVisible.set(true);
      }
     },
    close: () => { this.popover.isVisible.set(false), this.onClose(); },
  };

  modal = {
    width: 500,
    isVisible: signal(false),
    open: () => {
      if (!this.disabled) {
        this.onInit();
        this.modal.isVisible.set(true);
      }
    },
    close: () => { this.modal.isVisible.set(false); this.onClose(); },
  };

  abstract onInit(): void;
  abstract onClose(): void;

  ngOnInit() {
    if (this.layout === 'page') {
      this.onInit();
    }
  }

  ngOnDestroy() {
    if (this.layout === 'page') {
      this.onClose();
    }
  }

  /* -------------------- */

  close() {
    switch (this.layout) {
      case 'modal': this.modal.close(); break;
      case 'popover': this.popover.close(); break;
    }
  }
}
