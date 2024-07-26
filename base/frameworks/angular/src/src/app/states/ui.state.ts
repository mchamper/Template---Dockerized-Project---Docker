import { Injectable, computed, inject } from '@angular/core';
import { toggleDataFactory } from '../core/utils/factories/data.factory';
import { AbstractState } from '../core/states/abstract.state';
import { ScrollService } from '../core/services/scroll.service';

@Injectable({
  providedIn: 'root'
})
export class UiState extends AbstractState {

  private _scrollS = inject(ScrollService);

  /* -------------------- */

  fullscreen = this._store(toggleDataFactory(false), 'ui.fullscreen', {
    get: (schema) => schema.value(),
    set: (schema, value) => schema.value.set(value),
  })

  sidebar = {
    isVisible: this._store(toggleDataFactory(true), 'ui.sidebar.isVisible', {
      get: (schema) => schema.value(),
      set: (schema, value) => schema.value.set(value),
    })
  };

  header = {
    isVisible: computed(() => this._scrollS.scrollTop() < 100 || this._scrollS.isScrollingUp()),
    isTransparent: computed(() => this._scrollS.scrollTop() < 100),
  };
}
