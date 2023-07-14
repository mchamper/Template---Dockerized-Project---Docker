import { EventEmitter, inject, signal } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { difference, get, initial, isEqual, xor } from "lodash";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, Observable, of, skip, Subscription, tap } from "rxjs";
import { Form } from "../form/form";
import { scrollTo, stringToObject } from "src/app/helper";
import { IHttpResponse } from "src/app/interceptors/success.interceptor";
import { IHttpErrorResponse } from "src/app/interceptors/error.interceptor";
import { FormControl } from "@angular/forms";
import { Request } from "../request/request";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { environment } from "src/environments/environment";

export enum ListUnpreparedReasonEnum {
  IS_LOADING = 'IS_LOADING',
}

export interface IPage {
  data: any[];
  currentPage: number;
  lastPage: number;
  total: number;
}

export interface ILaravelPage {
  data: any[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface INestJsPage {
  items: any[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface INoPage {
  data: any[];
}

export class List<Item = any> {

  data = signal<Item[]>([]);
  currentPage = signal(1);
  lastPage = signal(1);
  total = signal(0);
  limit = signal(20);
  sort = signal('');
  selected = signal<any[]>([]);
  extras = signal<any>(null);

  request = new Request();
  actionRequest = new Request();
  filters = new Form();
  moreFiltersControl: FormControl = new FormControl<boolean>(false);
  queryParamsValue!: Object;

  nzExpandSet = new Set<number>();

  onChange$: EventEmitter<{
    page: number,
    reset: boolean,
    refresh?: boolean,
  }> = new EventEmitter();

  private _setPageMethod: 'Page' | 'LaravelPage' | 'NestJsPage' | 'NoPage';

  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  constructor(
    pageInterface: List['_setPageMethod'] = 'Page',
    private _options: {
      persistOnUrl?: boolean,
      fieldsToCheckOnSelect?: string[],
      request?: {
        scrollToTop?: boolean,
      } & Request['_options'],
      filters?: Form,
    } = {}
  ) {

    this._setPageMethod = pageInterface;

    if (this._options.request) {
      this.request = new Request({
        ...this._options.request,
        type: 'default',
      });
    }

    if (this._options.filters) {
      this.filters = this._options.filters;
    }

    this._init();
  }

  /* -------------------- */

  private _getQueryParams(page: number) {
    if (this._setPageMethod !== 'NoPage') {
      return {
        page,
        limit: this.limit(),
        sort: this.sort(),
        moreFilters: this.moreFiltersControl.value,
        ...this.filters.getQueryParamsFromValues(),
      };
    }

    return {
      moreFilters: this.moreFiltersControl.value,
      ...this.filters.getQueryParamsFromValues(),
    };
  }

  private _persistOnUrl(page?: number): void {
    this._router.navigate([], {
      queryParams: stringToObject(this._getQueryParams(page || this.currentPage()), true),
      replaceUrl: true,
    });
  }

  private _init() {
    if (this._options.persistOnUrl) {
      const queryParams = this._route.snapshot.queryParams;

      this.filters.setValuesFromQueryParams(queryParams);
      this.moreFiltersControl.setValue(!!queryParams['moreFilters']);

      this.currentPage.set(parseInt(queryParams['page'] || '1') || this.currentPage());
      this.limit.set(parseInt(queryParams['limit'] || '0') || this.limit());
      this.sort.set(queryParams['sort'] || this.sort());

      this.moreFiltersControl.valueChanges.pipe(
        takeUntilDestroyed(),
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe(() => {
        this._persistOnUrl();
      });
    }

    this.onChange$.pipe(
      takeUntilDestroyed()
    ).subscribe(({ page, reset }) => {
      if (this._options.persistOnUrl) {
        this._persistOnUrl(page);
      }

      this.run(page, reset);
    });

    this.filters.group.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      filter(() => this.filters.group.status === 'VALID')
    ).subscribe(() => {
      this.onChange$.emit({ page: 1, reset: true });
    });
  }

  /* -------------------- */

  reset(): void {
    this.data.set([]);
    this.currentPage.set(1);
    this.lastPage.set(1);
    this.total.set(0);
    this.extras.set(null);
    this.unselectAll();
  }

  setItem(item: any): void {
    this.data.update(value => {
      return [...value].map((itemData: any) => {
        if (typeof itemData.data !== 'undefined') {
          if (itemData.data?.id === item.data?.id) {
            return item;
          }
        } else {
          if (itemData.id === item.id) {
            return item;
          }
        }

        return itemData;
      });
    });
  }

  set(page: IPage | ILaravelPage | INestJsPage | INoPage, options?: { extras?: any }): void {
    'items' in page
      ? this.data.set(page.items)
      : this.data.set(page.data);

    this.extras.set(options?.extras);

    (this as any)[`_set${this._setPageMethod}`](page);
  }

  add(page: IPage | ILaravelPage | INestJsPage | INoPage): void {
    let data: Item[];

    'items' in page
      ? data = page.items
      : data = page.data;

    this.data.update(value => [ ...value, ...data]);

    (this as any)[`_set${this._setPageMethod}`](page);
  }

  private _setPage(page: IPage): void {
    this.currentPage.set(page.currentPage);
    this.lastPage.set(page.lastPage);
    this.total.set(page.total);
  }

  private _setLaravelPage(page: ILaravelPage): void {
    this.currentPage.set(page.current_page);
    this.lastPage.set(page.last_page);
    this.total.set(page.total);
  }

  private _setNestJsPage(page: INestJsPage): void {
    this.currentPage.set(page.meta.currentPage);
    this.lastPage.set(page.meta.totalPages);
    this.total.set(page.meta.totalItems);
  }

  private _setNoPage(page: INoPage): void {
    this.currentPage.set(1);
    this.lastPage.set(1);
    this.total.set(this.data().length);
  }

  /* -------------------- */

  isSelected(id: any): boolean {
    return this.selected().some(value => value === id);
  }

  canSelect(item: any, fieldsToCheck?: string[]): boolean {
    if (!fieldsToCheck) fieldsToCheck = this._options?.fieldsToCheckOnSelect;
    return (fieldsToCheck as []).some(field => !!item[field]);
  }

  select(...ids: any[]): void {
    ids.forEach(id => this.selected.update((value) => xor(value, [id])));
  }

  isAllSelected(attribute: string = 'id'): boolean {
    if (this.data()[0] && 'data' in (this.data()[0] as any)) {
      attribute = `data.${attribute}`;
    }

    return !!this.selected().length && this.data().every((item: any) => this.isSelected(get(item, attribute)));
  }

  canSelectAll(fieldsToCheck?: string[]): boolean {
    if (!fieldsToCheck) fieldsToCheck = this._options?.fieldsToCheckOnSelect;
    return this.data().some(item => this.canSelect(item, fieldsToCheck));
  }

  selectAll(attribute: string = 'id'): void {
    if (this.data()[0] && 'data' in (this.data()[0] as any)) {
      attribute = `data.${attribute}`;
    }

    let ids: any[] = difference(this.data().map((item: any) => get(item, attribute)), this.selected());

    if (!ids.length) {
      ids = this.data().map((item: any) => get(item, attribute));
    }

    this.select(...ids);
  }

  unselectAll(): void {
    this.selected.set([]);
  }

  /* -------------------- */

  refresh = (reset: boolean = false): void => {
    this.unselectAll();

    this.onChange$.emit({
      page: this.currentPage(),
      reset,
      refresh: true,
    });
  }

  /* -------------------- */

  onNzExpandChange(id: number, checked: boolean): void {
    checked
      ? this.nzExpandSet.add(id)
      : this.nzExpandSet.delete(id);
  }

  onNzQueryParamsChange(event: NzTableQueryParams): void {
    const page = event.pageIndex;
    const sort = event.sort.find(item => item.value);

    if (sort) {
      this.sort.set(sort.value === 'descend'
        ? `-${sort?.key}`
        : `${sort?.key}`
      );
    } else {
      this.sort.set('');
    }

    this.onChange$.emit({
      page,
      reset: false,
    });
  }

  onNzPageSizeChange(event: number): void {
    this.limit.set(event);

    this.onChange$.emit({
      page: 1,
      reset: true
    });
  }

  /* -------------------- */

  prepare(): {
    status: boolean,
    reason?: ListUnpreparedReasonEnum
  } {
    if (this.request.isLoading()) {
      return {
        status: false,
        reason: ListUnpreparedReasonEnum.IS_LOADING,
      };
    }

    return {
      status: true
    };
  }

  /* -------------------- */

  send(...params: any): Observable<IHttpResponse> {
    const options = {
      ...this._options.request,
      scrollToTop: get(this._options.request, 'scrollToTop', true),
    };

    const isPrepared = this.prepare();

    if (!environment.production) {
      console.log('List prepared:', isPrepared);
    }

    if (!isPrepared.status && isPrepared.reason) {
      return of();
    }

    if (options.scrollToTop) {
      scrollTo(0);
    }

    return this.request.send(params);
  }

  run = (...params: any): Subscription => {
    return this.send(...params).subscribe();
  }
}
