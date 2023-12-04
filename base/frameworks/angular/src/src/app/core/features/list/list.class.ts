import { Injector, ProviderToken, computed, inject, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { difference, get, xor } from "lodash";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, skip } from "rxjs";
import { Request } from "../request/request.class";
import { Form } from "../form/form.class";
import { logger } from "../../utils/helpers/logger.helper";
import { base64Decode, base64Encode } from "../../utils/helpers/hash.helper";
import { RouteService } from "../../services/route.service";
import { ListChangeEnum } from "./enums/list-change.enum";
import { scrollTo } from "../../utils/helpers/scroll.helper";

export class List<Item = any> {

  private _router = this._inject(Router);
  private _routeS = this._inject(RouteService);

  data = signal<Item[]>([]);
  currentPage = signal(1);
  lastPage = signal(1);
  total = signal(0);
  limit = signal(10);
  sort = signal('');
  selected = signal<any[]>([]);
  extras = signal<any>(null);

  request = new Request({ injector: this._options.injector });
  actionRequest = new Request({ injector: this._options.injector });
  filters = new Form(undefined, { injector: this._options.injector });

  change$ = new BehaviorSubject<ListChangeEnum>(ListChangeEnum.UNDEFINED);

  urlVersion = 0;
  queryParamHash = signal(this._routeS.current.queryParams()[this._getQueryParamName()] || '');
  queryParams = computed(() => base64Decode(this.queryParamHash()));
  lastQueryParamHash = signal('');
  lastQueryParams = computed(() => base64Decode(this.lastQueryParamHash()));

  constructor(
    private _options: {
      name?: string,
      persistOnUrl?: boolean,
      scrollToTop?: boolean,
      fieldsToCheckOnSelect?: string[],
      request?: Request['_options'],
      filters?: Form,
      injector?: Injector,
    } = {}
  ) {

    this._options = {
      ...this._options,
      scrollToTop: get(this._options, 'scrollToTop', true),
    };

    this._createRequests();

    if (this._options.filters) {
      this.filters = this._options.filters;
    }

    this.filters.extraGroup.addControl('more', new FormControl(false));

    this._init();
  }

  private _inject<T = any>(token: ProviderToken<T>) {
    return this._options.injector?.get(token) || inject(token);
  }

  /* -------------------- */

  private _createRequests() {
    if (this._options.request) {
      this.request = new Request({
        ...this._options.request,
        before: () => {
          if (this._options.scrollToTop) {
            scrollTo(0);
          }
        },
        success: (httpRes) => {
          this.set(this.request.body());

          if (this._options.request!.success) {
            this._options.request!.success(httpRes);
          }
        },
        cancelable: true,
        type: 'default',
        injector: this._options.injector,
      });
    }
  }

  /* -------------------- */

  private _getQueryParamName() {
    return this._options.name ? this._options.name : `list`;
  }

  private _persistOnUrl(options?: { replaceUrl?: boolean }): void {
    logger('List persisting on url.');

    const newQueryParamHash = base64Encode({
      page: this.currentPage(),
      limit: this.limit(),
      sort: this.sort(),
      filters: this.filters.group.value,
      moreFilters: this.filters.extraGroup.get('more')!.value,
    });

    this.lastQueryParamHash.set(this.queryParamHash());
    this.queryParamHash.set(newQueryParamHash);

    this._router.navigate([], {
      queryParams: { [this._getQueryParamName()]: this.queryParamHash() },
      replaceUrl: true,
    });
  }

  private _setValuesFromUrl() {
    if (this.queryParamHash()) {
      this.currentPage.set(this.queryParams()['page']);
      this.limit.set(this.queryParams()['limit']);
      this.sort.set(this.queryParams()['sort']);
      this.filters.group.reset(this.queryParams()['filters'], { emitEvent: true });
      this.filters.extraGroup.get('more')!.setValue(this.queryParams()['moreFilters'], { emitEvent: true });
    }
  }

  /* -------------------- */

  private _init() {
    const skipValue = this.queryParamHash() ? 1 : 0;

    toObservable(this.currentPage).pipe(
      takeUntilDestroyed(),
      skip(1),
    ).subscribe(() => {
      this.change$.next(ListChangeEnum.PAGE);
    });

    toObservable(this.limit).pipe(
      takeUntilDestroyed(),
      skip(1),
    ).subscribe(() => {
      this.change$.next(ListChangeEnum.LIMIT);
    });

    toObservable(this.sort).pipe(
      takeUntilDestroyed(),
      skip(1),
    ).subscribe(() => {
      this.change$.next(ListChangeEnum.SORT);
    });

    this.filters.group.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      filter(() => this.filters.group.valid),
      skip(skipValue),
    ).subscribe(() => {
      this.currentPage.set(1);
      this.change$.next(ListChangeEnum.FILTERS);
    });

    this.filters.extraGroup.get('more')!.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      skip(skipValue)
    ).subscribe(() => {
      this.change$.next(ListChangeEnum.MORE_FILTERS);
    });

    this._options.persistOnUrl
      ? this._initWithPersistOnUrl()
      : this._initDefault();
  }

  private _initWithPersistOnUrl() {
    this.change$.pipe(
      takeUntilDestroyed(),
      skip(1),
    ).subscribe(change => {
      logger(`List "${change}" change received.`);

      if (![ListChangeEnum.MORE_FILTERS].includes(this.change$.value)) {
        this.submit();
      }

      this._persistOnUrl();
    });

    !this.queryParamHash()
      ? this._persistOnUrl({ replaceUrl: true })
      : this._setValuesFromUrl();

    setTimeout(() => this.submit());
  }

  private _initDefault() {
    this.change$.pipe(
      takeUntilDestroyed(),
      skip(1),
    ).subscribe(change => {
      logger(`List "${change}" change received.`);

      if (![ListChangeEnum.MORE_FILTERS].includes(this.change$.value)) {
        this.submit();
      }
    });

    setTimeout(() => this.submit());
  }

  /* -------------------- */

  onNzQueryParamsChange(event: NzTableQueryParams): void {
    const page = event.pageIndex;
    const limit = event.pageSize;
    const sort = event.sort.find(item => !!item.value);
    const sortValue = sort ? sort.value === 'descend' ? `-${sort?.key}` : `${sort?.key}` : '';

    if (
      page !== this.currentPage()
      || limit !== this.limit()
      || sortValue !== this.sort()
    ) {
      this.currentPage.set(page);
      this.limit.set(limit);
      this.sort.set(sortValue);
    }
  }

  /* -------------------- */

  submit() {
    logger('List submiting.');
    this.request.run();
  }

  /* -------------------- */

  getRequests(): Request[] {
    return [
      this.request,
      this.actionRequest,
    ];
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

  set(page: any, options?: { extras?: any }): void {
    'items' in page
      ? this.data.set(page.items)
      : this.data.set(page.data);

    this.extras.set(options?.extras);

    this._updateMeta(page);
  }

  add(page: any): void {
    let data: Item[];

    'items' in page
      ? data = page.items
      : data = page.data;

    this.data.update(value => [ ...value, ...data]);

    this._updateMeta(page);
  }

  private _updateMeta(page: any) {
    this.currentPage.set(page.currentPage || page.current_page || page.meta?.currentPage || 1);
    this.lastPage.set(page.lastPage || page.last_page || page.meta?.totalPages || 1);
    this.total.set(page.total || page.meta?.totalItems || this.data().length);
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

  refresh = (): void => {
    this.unselectAll();
    this.submit();
  }
}
