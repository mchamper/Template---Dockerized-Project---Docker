import { Injectable, computed, inject, signal } from '@angular/core';
import { get } from 'lodash';
import { fromEvent } from 'rxjs';
import { SsrService } from './ssr.service';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  private _ssrS = inject(SsrService);

  scrollTop = signal(0);
  lastScrollTop = signal(0);

  isScrollingUp = computed(() => this.scrollTop() < this.lastScrollTop());
  isScrollingDown = computed(() => this.scrollTop() > this.lastScrollTop());

  constructor() {
    if (this._ssrS.isServer()) return;

    fromEvent(window, 'scroll').subscribe(event => {
      const scrollTop = get(event, 'target.scrollingElement.scrollTop', 0);

      this.lastScrollTop.set(this.scrollTop());
      this.scrollTop.set(scrollTop);
    });
  }
}
