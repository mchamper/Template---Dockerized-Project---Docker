import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { List } from '../../features/list/list.class';

@Component({
  template: '',
})
export abstract class AbstractListComponent {

  @Input({ required: true }) list!: List;
  @Input() rowActionsWidth?: string;
  @ContentChild('rowActionsTpl') customRowActionsTpl?: TemplateRef<any>;
}
