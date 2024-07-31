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

  fullscreen = this._storageS.store(toggleDataFactory(false), 'ui.fullscreen', {
    get: (entity) => entity.value(),
    set: (entity, value) => entity.value.set(value),
  })

  sidebar = {
    isVisible: this._storageS.store(toggleDataFactory(true), 'ui.sidebar.isVisible', {
      get: (entity) => entity.value(),
      set: (entity, value) => entity.value.set(value),
    })
  };

  header = {
    isVisible: computed(() => this._scrollS.scrollTop() < 100 || this._scrollS.isScrollingUp()),
    isTransparent: computed(() => this._scrollS.scrollTop() < 100),
  };
}
