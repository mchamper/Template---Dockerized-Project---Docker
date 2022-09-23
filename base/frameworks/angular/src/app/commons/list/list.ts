import { EventEmitter } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { difference, xor } from "lodash";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { debounceTime, distinctUntilChanged, skip, Subscription } from "rxjs";
import { stringToObject } from "../helper";
import { ICallback } from "../types/callback.interface";
import { factory } from "./factory";
import { Form } from "./form";
import { Request } from "./request";

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

export interface INoPage {
  data: any[];
}

export class List<T> {

  columns: { [key: string]: { sortFn?: any } } = {};
  data: T[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;
  limit: number = 20;
  sort: string = '';
  selected: any[] = [];
  extras: any = null;

  request: Request = new Request();
  filtersForm!: Form;

  changes$: EventEmitter<{
    page: number,
    reset: boolean,
    refresh?: boolean,
  }> = new EventEmitter();

  private _setPageMethod!: string;

  constructor(
    pageInterface: 'Page'|'LaravelPage'|'NoPage' = 'Page',
    columns: { [key: string]: { sortFn?: any } } = {},
  ) {

    this._setPageMethod = pageInterface;
    this.columns = columns;
  }

  /* -------------------- */

  initNg(
    callback: ICallback,
    options?: {
      router: Router,
      route: ActivatedRoute,
    }
  ): Subscription[] {

    const subscriptions: Subscription[] = [];

    if (options?.router && options?.route) {
      this.filtersForm?.setValuesFromQueryParams(options.route.snapshot.queryParams);

      subscriptions.push(this.changes$.pipe(skip(this._setPageMethod !== 'NoPage' ? 1 : 0)).subscribe(({ page, reset, refresh }) => {
        if (refresh) {
          callback.action(page, reset);
          return;
        }

        let queryParams;

        if (this._setPageMethod !== 'NoPage') {
          queryParams = {
            page,
            limit: this.limit,
            sort: this.sort,
            ...this.filtersForm?.getValuesForQueryParams(),
          };
        } else {
          queryParams = {
            ...this.filtersForm?.getValuesForQueryParams(),
          };
        }

        options.router.navigate([], {
          queryParams: stringToObject(queryParams, true),
          state: { reset },
        });
      }));

      subscriptions.push(options.route.queryParams.subscribe((queryParams: Params) => {
        const page: number = parseInt(queryParams['page'] || '1') || this.currentPage;
        this.limit = parseInt(queryParams['limit'] || '0') || this.limit;
        this.sort = queryParams['sort'] || this.sort;

        callback.action(page, options.router.getCurrentNavigation()?.extras?.state?.['reset'] || false);
      }));
    } else {
      subscriptions.push(this.changes$.subscribe(({ page, reset }) => {
        callback.action(page, reset);
      }));
    }

    subscriptions.push(this.filtersForm?.group.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(() => this.changes$.emit({ page: 1, reset: true })));

    return subscriptions;
  }

  /* -------------------- */

  reset(): void {
    this.data = [];
    this.currentPage = 1;
    this.lastPage = 1;
    this.total = 0;
    this.selected = [];
    this.extras = null;
  }

  set(page: IPage|ILaravelPage|INoPage, options?: { extras?: any, className?: any }): void {
    this.data = options?.className
      ? factory.createMany<T>(page.data, options.className)
      : page.data;

    this.extras = options?.extras;

    (this as any)[`_set${this._setPageMethod}`](page);
  }

  add(page: IPage|ILaravelPage|INoPage, options?: { className?: any }): void {
    const data: T[] = options?.className
      ? factory.createMany<T>(page.data, options.className)
      : page.data;

    this.data = [...this.data, ...data];

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
    return !!this.selected.length && this.data.every((item: any) => this.isSelected(item[attribute]));
  }

  selectAll(attribute: string = 'id'): void {
    let ids: any[] = difference(this.data.map((item: any) => item[attribute]), this.selected);

    if (!ids.length) {
      ids = this.data.map((item: any) => item[attribute]);
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
}
