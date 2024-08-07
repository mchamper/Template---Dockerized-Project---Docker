import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';
import { RouteService } from '../services/route.service';
import { environment } from '../../../environments/environment';
import { TTaxonomies, TTaxonomy } from '../types/taxonomy.type';
// import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { SsrService } from './ssr.service';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {

  private _dom = inject(DOCUMENT);
  private _title = inject(Title);
  private _meta = inject(Meta);
  private _routeS = inject(RouteService);
  private _ssrS = inject(SsrService);
  // private _googleTagManagerS = inject(GoogleTagManagerService)

  taxonomies: TTaxonomies = [];

  get domBaseUrl(): string {
    return environment.appUrl;
  }

  /* -------------------- */

  init(taxonomies: TTaxonomies, options?: { initGoogleTagManager?: boolean }): void {
    this.taxonomies = [
      ...this.taxonomies,
      ...taxonomies,
    ];

    this._routeS.onNavigationEnd$().subscribe((value) => {
      this._resolve();

      if (this._ssrS.isBrowser()) {
        if (options?.initGoogleTagManager) {
          // this._googleTagManagerS.pushTag({
          //   event: 'page',
          //   pageName: value.url
          // });
        }
      }
    });
  }

  /* -------------------- */

  private _resolve(): void {
    const taxonomyDefault = cloneDeep(this.taxonomies.find(taxonomy => taxonomy.page === '__DEFAULT__'));

    const taxonomy = {
      ...taxonomyDefault,
      ...cloneDeep(this.taxonomies.find(taxonomy => taxonomy.page === this._routeS.current.data().name))
    } as TTaxonomy;

    /* -------------------- */

    this._title.setTitle(taxonomy.title);
    this._meta.updateTag({ name: 'robots', content: this._getIndex(taxonomy.index) });
    this._meta.updateTag({ name: 'description', content: taxonomy.description });
    this._meta.updateTag({ name: 'keywords', content: taxonomy.keywords });

    this._dom.querySelector('[rel="canonical"]')?.setAttribute('href', taxonomy.canonical || `${this.domBaseUrl}${this._routeS.current.url().split('?')[0]}`);
  }

  /* -------------------- */

  private _getIndex(value: TTaxonomy['index']): string {
    if (!environment.production) value = false;

    switch(value) {
      case true: return 'INDEX,FOLLOW';
      case false: return 'NOINDEX,NOFOLLOW';

      default: return value as string;
    }
  }
}
