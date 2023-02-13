import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';
import { environment } from 'src/environments/environment';
import { ITaxonomy, taxonomies } from './taxonomies';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {

  constructor(
    @Inject(DOCUMENT) private _dom: Document,
    private _title: Title,
    private _meta: Meta,
  ) { }

  get domBaseUrl(): string {
    return environment.appUrl;
  }

  /* -------------------- */

  resolve(currentPage: any): void {
    const taxonomyDefault = cloneDeep(taxonomies.find(taxonomy => taxonomy.page === '__DEFAULT__'));

    const taxonomy = {
      ...taxonomyDefault,
      ...cloneDeep(taxonomies.find(taxonomy => taxonomy.page === currentPage.page))
    } as ITaxonomy;

    if (currentPage.isSolofo) {
      taxonomy.index = false;
      taxonomy.canonical = `${this.domBaseUrl}/cotizador`;
    }

    /* -------------------- */

    this._title.setTitle(taxonomy.title);
    this._meta.updateTag({ name: 'robots', content: this._getIndex(taxonomy.index) });
    this._meta.updateTag({ name: 'description', content: taxonomy.description });
    this._meta.updateTag({ name: 'keywords', content: taxonomy.keywords });

    this._dom.querySelector('[rel="canonical"]')?.setAttribute('href', taxonomy.canonical || `${this.domBaseUrl}${currentPage.url?.split('?')[0]}`);
  }

  /* -------------------- */

  private _getIndex(value: ITaxonomy['index']): string {
    if (!environment.production) value = false;

    switch(value) {
      case true: return 'INDEX,FOLLOW';
      case false: return 'NOINDEX,NOFOLLOW';

      default: return value as string;
    }
  }
}
