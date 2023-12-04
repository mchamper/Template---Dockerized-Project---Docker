import { EventEmitter, Injector, ProviderToken, computed, inject, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { difference, get, xor } from "lodash";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, first, skip } from "rxjs";
import { Request } from "../request/request.class";
import { Form } from "../form/form.class";
import { logger } from "../../utils/helpers/logger.helper";
import { base64Decode, base64Encode } from "../../utils/helpers/hash.helper";
import { RouteService } from "../../services/route.service";
import { RouteNavigationStateTypeEnum } from "../../enums/route-navigation-state-type.enum";

export class List<Item = any> {

  private _router = this._inject(Router);
  private _routeS = this._inject(RouteService);

  data = signal<Item[]>([]);
  currentPage = signal(1);
  lastPage = signal(1);
  total = signal(0);
  limit = signal(3);
  sort = signal('');
  selected = signal<any[]>([]);
  extras = signal<any>(null);

  request = new Request({ injector: this._options.injector });
  actionRequest = new Request({ injector: this._options.injector });
  filters = new Form(undefined, { injector: this._options.injector });

  change$ = new BehaviorSubject<'moreFiltersChange' | 'filtersChange' | 'nzQueryParamsChange' | undefined>(undefined);
  isFirstChange = signal(true);
  // change = signal<'moreFiltersChange' | 'filtersChange' | 'nzQueryParamsChange' | undefined>(undefined);
  // isFirstChange = computed(() => this.change() !== undefined);

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
            scrollTo(0, 0);
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

  private _persistOnUrl(options?: { replaceUrl?: boolean, stateType?: RouteNavigationStateTypeEnum }): void {
    logger('List PERSISTING on url.', options);

    this._router.navigate([], {
      queryParams: {
        [this._getQueryParamName()]: base64Encode({
          page: this.currentPage(),
          limit: this.limit(),
          sort: this.sort(),
          filters: this.filters.group.value,
          moreFilters: this.filters.extraGroup.get('more')!.value,
          change: this.change$.value,
        }),
      },
      replaceUrl: !!options?.replaceUrl,
      state: {
        type: options?.stateType
      }
    });
  }

  /* -------------------- */

  private _init() {
    this.filters.extraGroup.get('more')!.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(value => {
      logger('List MORE FILTERS CHANGE received. Value:', value);

      this.change$.next('moreFiltersChange');
    });

    this.filters.group.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      filter(() => this.filters.group.valid)
    ).subscribe(() => {
      logger('List FILTER CHANGE received.');

      this.currentPage.set(1);
      this.change$.next('filtersChange');
    });

    this._options.persistOnUrl
      ? this._initWithPersistOnUrl()
      : this._initDefault();
  }

  private _initWithPersistOnUrl() {
    this.change$.pipe(
      takeUntilDestroyed(),
      skip(1),
    ).subscribe(() => {
      logger('List CHANGE received.');
      this._persistOnUrl();
    });

    toObservable(this._routeS.current.queryParams).pipe(
      takeUntilDestroyed(),
    ).subscribe(params => {
      logger('List ROUTE CHANGE received.');

      const queryParamsEnconded = params[this._getQueryParamName()];

      if (queryParamsEnconded) {
        const queryParams = base64Decode(queryParamsEnconded);
        const change = queryParams['change'];

        this.currentPage.set(queryParams['page']);
        this.limit.set(queryParams['limit']);
        this.sort.set(queryParams['sort']);
        this.filters.group.reset(queryParams['filters'], { emitEvent: false });
        this.filters.extraGroup.get('more')!.setValue(queryParams['moreFilters'], { emitEvent: false });

        if (change !== 'moreFiltersChange') {
          this.submit();
        }
      } else {
        this._persistOnUrl({ replaceUrl: true });
      }
    });
  }

  private _initDefault() {
    this.change$.pipe(
      takeUntilDestroyed(),
    ).subscribe(() => {
      logger('List CHANGE received.');
      this.submit();
    });
  }

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
      logger('List "NzQueryParamsChange" received.', event);

      this.currentPage.set(page);
      this.limit.set(limit);
      this.sort.set(sortValue);

      this.change$.next('nzQueryParamsChange');
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
