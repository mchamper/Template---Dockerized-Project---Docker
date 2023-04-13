import { EventEmitter, inject } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { difference, get, isEqual, xor } from "lodash";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, of, skip, Subscription, tap } from "rxjs";
import { Form } from "../form/form";
import { RequestHandler } from "../handlers/request-handler/request-handler";
import { scrollTo, stringToObject } from "src/app/helper";
import { IHttpResponse } from "src/app/interceptors/success.interceptor";
import { IHttpErrorResponse } from "src/app/interceptors/error.interceptor";
import { FormControl } from "@angular/forms";

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

export class List<T = any> {

  data: T[] = [];
  data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;
  limit: number = 20;
  sort: string = '';
  selected: any[] = [];
  extras: any = null;

  action: Form = new Form();
  filters: Form = new Form();
  moreFiltersControl: FormControl = new FormControl<boolean>(false);
  queryParamsValue!: Object;

  requestH: RequestHandler = new RequestHandler();

  nzExpandSet = new Set<number>();

  changes$: EventEmitter<{
    page: number,
    reset: boolean,
    refresh?: boolean,
  }> = new EventEmitter();

  private _setPageMethod!: string;

  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  constructor(
    pageInterface: 'Page' | 'LaravelPage' | 'NestJsPage' | 'NoPage' = 'Page',
  ) {

    this._setPageMethod = pageInterface;
  }

  /* -------------------- */

  init(
    getList: (page: number, reset: boolean) => any,
    options?: {
      persistOnUrl: boolean
    }
  ): Subscription[] {

    const subscriptions: Subscription[] = [];

    if (options?.persistOnUrl) {
      this.filters.setValuesFromQueryParams(this._route.snapshot.queryParams);
      this.moreFiltersControl.setValue(!!this._route.snapshot.queryParams['moreFilters']);

      subscriptions.push(this.changes$.pipe(skip(this._setPageMethod !== 'NoPage' ? 1 : 0)).subscribe(({ page, reset, refresh }) => {
        if (refresh) {
          getList(page, reset);
          return;
        }

        let queryParams;

        if (this._setPageMethod !== 'NoPage') {
          queryParams = {
            page,
            limit: this.limit,
            sort: this.sort,
            moreFilters: this.moreFiltersControl.value,
            ...this.filters.getValuesForQueryParams(),
          };
        } else {
          queryParams = {
            moreFilters: this.moreFiltersControl.value,
            ...this.filters.getValuesForQueryParams(),
          };
        }

        this._router.navigate([], {
          queryParams: stringToObject(queryParams, true),
          replaceUrl: true,
          state: { reset },
        });
      }));

      subscriptions.push(this._route.queryParams.subscribe((queryParams: Params) => {
        const queryParamsValue = {
          ...this.filters.group.value,
          page: '1',
          limit: this.limit + '',
          sort: this.sort,
          ...queryParams,
          moreFilters: null,
        };

        if (isEqual(queryParamsValue, this.queryParamsValue)) {
          return;
        }

        this.queryParamsValue = { ...queryParamsValue };

        const page: number = parseInt(queryParams['page'] || '1') || this.currentPage;
        this.limit = parseInt(queryParams['limit'] || '0') || this.limit;
        this.sort = queryParams['sort'] || this.sort;

        getList(page, this._router.getCurrentNavigation()?.extras?.state?.['reset'] || false);
      }));
    } else {
      subscriptions.push(this.changes$.subscribe(({ page, reset }) => {
        getList(page, reset);
      }));
    }

    subscriptions.push(this.filters.group.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(value => {
      this.changes$.emit({ page: 1, reset: true });
    }));

    subscriptions.push(this.moreFiltersControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(value => {
      this.changes$.emit({ page: this.currentPage, reset: false });
    }));

    return subscriptions;
  }

  /* -------------------- */

  reset(): void {
    this.data$.next([]);
    this.data = [];
    this.currentPage = 1;
    this.lastPage = 1;
    this.total = 0;
    this.selected = [];
    this.extras = null;
  }

  setItem(item: any): void {
    this.data = [...this.data].map((itemData: any) => {
      if (itemData.id === item.id) {
        return item;
      }

      return itemData;
    });

    this.data$.next(this.data);
  }

  set(page: IPage | ILaravelPage | INestJsPage | INoPage, options?: { extras?: any }): void {
    'items' in page
      ? this.data = page.items
      : this.data = page.data;

    this.data$.next(this.data);

    this.extras = options?.extras;

    (this as any)[`_set${this._setPageMethod}`](page);
  }

  add(page: IPage | ILaravelPage | INestJsPage | INoPage): void {
    let data: T[];

    'items' in page
      ? data = page.items
      : data = page.data;

    this.data = [...this.data, ...data];
    this.data$.next(this.data);

    (this as any)[`_set${this._setPageMethod}`](page);
  }

  private _setPage(page: IPage): void {
    this.currentPage = page.currentPage;
    this.lastPage = page.lastPage;
    this.total = page.total;
  }

  private _setLaravelPage(page: ILaravelPage): void {
    this.currentPage = page.current_page;
    this.lastPage = page.last_page;
    this.total = page.total;
  }

  private _setNestJsPage(page: INestJsPage): void {
    this.currentPage = page.meta.currentPage;
    this.lastPage = page.meta.totalPages;
    this.total = page.meta.totalItems;
  }

  private _setNoPage(page: INoPage): void {
    this.currentPage = 1;
    this.lastPage = 1;
    this.total = this.data.length;
  }

  /* -------------------- */

  isSelected(id: any): boolean {
    return this.selected.some(value => value === id);
  }

  select(...ids: any[]): void {
    ids.forEach(id => this.selected = xor(this.selected, [id]));
  }

  isAllSelected(attribute: string = 'id'): boolean {
    if (this.data[0] && 'data' in (this.data[0] as any)) {
      attribute = `data.${attribute}`;
    }

    return !!this.selected.length && this.data.every((item: any) => this.isSelected(get(item, attribute)));
  }

  selectAll(attribute: string = 'id'): void {
    if (this.data[0] && 'data' in (this.data[0] as any)) {
      attribute = `data.${attribute}`;
    }

    let ids: any[] = difference(this.data.map((item: any) => get(item, attribute)), this.selected);

    if (!ids.length) {
      ids = this.data.map((item: any) => get(item, attribute));
    }

    this.select(...ids);
  }

  unselectAll(): void {
    this.selected = [];
  }

  /* -------------------- */

  refresh = (reset: boolean = false): void => {
    this.changes$.emit({
      page: this.currentPage,
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
      this.sort = sort.value === 'descend'
        ? `-${sort?.key}`
        : `${sort?.key}`
    } else {
      this.sort = '';
    }

    this.changes$.emit({
      page,
      reset: false,
    });
  }

  onNzPageSizeChange(event: number): void {
    this.limit = event;

    this.changes$.emit({
      page: 1,
      reset: true
    });
  }

  /* -------------------- */

  prepare(): {
    status: boolean,
    reason?: ListUnpreparedReasonEnum
  } {
    if (this.requestH.isLoading()) {
      return {
        status: false,
        reason: ListUnpreparedReasonEnum.IS_LOADING,
      };
    }

    return {
      status: true
    };
  }

  send(
    observable: Observable<any>,
    options?: {
      unprepared?: (reason: ListUnpreparedReasonEnum) => void,
      before?: () => void,
      success?: (res: IHttpResponse) => void,
      error?: (err: IHttpErrorResponse) => void,
      after?: () => void,
      scrollToTop?: boolean,
    }
  ): Observable<IHttpResponse> {
    const defaultOptions = {
      unprepared: typeof options?.unprepared !== 'undefined' ? options?.unprepared : null,
      before: typeof options?.before !== 'undefined' ? options?.before : null,
      success: typeof options?.success !== 'undefined' ? options?.success : null,
      error: typeof options?.error !== 'undefined' ? options?.error : null,
      after: typeof options?.after !== 'undefined' ? options?.after : null,
      scrollToTop: typeof options?.scrollToTop !== 'undefined' ? options?.scrollToTop : true,
    }

    const prepare = this.prepare();

    if (!prepare.status && prepare.reason) {
      if (defaultOptions.unprepared) {
        defaultOptions.unprepared(prepare.reason);
      }

      return of();
    }

    if (defaultOptions.scrollToTop) {
      scrollTo(0);
    }

    if (defaultOptions.before) {
      defaultOptions.before();
    }

    return this.requestH.send(observable).pipe(
      tap({
        next: (res: IHttpResponse) => {
          if (defaultOptions.success) {
            defaultOptions.success(res);
          }
        },
        error: (err: IHttpErrorResponse) => {
          if (defaultOptions.error) {
            defaultOptions.error(err);
          }
        },
        complete: () => {
          if (defaultOptions.after) defaultOptions.after();
        },
      }),
    );
  }
}
