import { DestroyRef, EventEmitter, Injector, ProviderToken, WritableSignal, computed, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { difference, get, isUndefined, xor } from "lodash";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { debounceTime, distinctUntilChanged, filter, skip, startWith } from "rxjs";
import { Request } from "../request/request.class";
import { Form } from "../form/form.class";
import { logger } from "../../utils/helpers/logger.helper";
import { base64Decode, base64Encode, md5 } from "../../utils/helpers/hash.helper";
import { RouteService } from "../../services/route.service";
import { scrollTo } from "../../utils/helpers/scroll.helper";

export class List<Item = any> {

  private _fb: FormBuilder;
  private _router: Router;
  private _routeS: RouteService;

  data = signal<Item[]>([]);
  currentPage = signal(1);
  lastPage = signal(1);
  total = signal(0);
  limit: WritableSignal<number>;
  sort = signal('');
  selected = signal<any[]>([]);
  extras = signal<any>(null);

  request: Request;
  actionRequest: Request;
  filters: Form;

  change$ = new EventEmitter<{ name?: string, mustSubmit?: boolean } | undefined>();
  queryParamHash = computed(() => this._routeS.current.queryParams()[this._getQueryParamName()] || '');
  queryParams = computed(() => this.queryParamHash() ? base64Decode(this.queryParamHash()) : null);

  constructor(
    private _options: {
      name?: string,
      persistOnUrl?: boolean,
      scrollToTop?: boolean,
      fieldsToCheckOnSelect?: string[],
      limit?: number,
      data?: Item[],
      request?: Request['_options'],
      filters?: Form,
      injector?: Injector,
    } = {}
  ) {

    this._options = {
      ...this._options,
      scrollToTop: get(this._options, 'scrollToTop', true),
    };

    this._fb = this._inject(FormBuilder);
    this._router = this._inject(Router);
    this._routeS = this._inject(RouteService);

    this.request = new Request({ injector: this._inject(Injector) });
    this.actionRequest = new Request({ injector: this._inject(Injector) });
    this.filters = new Form(undefined, { injector: this._inject(Injector) });

    this.limit = signal(!isUndefined(this._options.limit) ? this._options.limit : 10);

    /* -------------------- */

    if (this._options.filters) {
      if (!this._options.filters.group.get('main') || !(this._options.filters.group.get('main') instanceof FormGroup)) {
        throw('The filters form MUST have a main group named "main".');
      }

      this.filters = this._options.filters;

      this.filters.group.addControl('utils', this._fb.group({
        moreFilters: this._fb.control(false),
      }));

      this.filters.set();
    }

    this._createRequests();

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
          if (this._options.request!.watch) {
            this.set(this.request.body());
          }

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
    return this._options.name ? this._options.name : `listParams`;
  }

  private _persistOnUrl(options?: { replaceUrl?: boolean }): void {
    const newQueryParamHash = base64Encode({
      page: this.currentPage(),
      limit: this.limit(),
      sort: this.sort(),
      filters: this.filters.group.value,
    });

    if (this.queryParamHash() === newQueryParamHash) {
      return;
    }

    logger('List persisting on url.');

    this._router.navigate([], {
      queryParams: { [this._getQueryParamName()]: newQueryParamHash },
      replaceUrl: options?.replaceUrl,
    });
  }

  /* -------------------- */

  private _init() {
    toObservable(this.currentPage, { injector: this._inject(Injector) }).pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
      skip(1),
    ).subscribe(() => {
      this.change$.emit({ name: 'PAGE', mustSubmit: true });
    });

    toObservable(this.limit, { injector: this._inject(Injector) }).pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
      skip(1),
    ).subscribe(() => {
      this.change$.emit({ name: 'LIMIT', mustSubmit: true });
    });

    toObservable(this.sort, { injector: this._inject(Injector) }).pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
      skip(1),
    ).subscribe(() => {
      this.change$.emit({ name: 'SORT', mustSubmit: true });
    });

    this.filters.getGroup('main')?.valueChanges.pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
      startWith(this.filters.getValue('main')),
      debounceTime(300),
      distinctUntilChanged((previous, current) => md5(previous) === md5(current)),
      filter(() => this.filters.group.valid),
      skip(1),
    ).subscribe(() => {
      this.currentPage.set(1);
      this.change$.emit({ name: 'FILTERS', mustSubmit: true });
    });

    this.filters.getGroup('utils')?.valueChanges.pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
      startWith(this.filters.getValue('utils')),
      debounceTime(300),
      distinctUntilChanged((previous, current) => md5(previous) === md5(current)),
      filter(() => this.filters.group.valid),
      skip(1),
    ).subscribe(() => {
      this.change$.emit({ name: 'UTILS', mustSubmit: false });
    });

    this._options.persistOnUrl
      ? this._initWithPersistOnUrl()
      : this._initDefault();
  }

  private _initWithPersistOnUrl() {
    this.change$.pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
    ).subscribe(change => {
      logger(`List change received from "${change?.name}". Must submit?`, !!change?.mustSubmit);

      if (change?.mustSubmit) {
        this.submit();
      }

      this._persistOnUrl();
    });

    const onQueryParamHashChange = () => {
      if (this.queryParams()) {
        this.currentPage.set(this.queryParams()['page']);
        this.limit.set(this.queryParams()['limit']);
        this.sort.set(this.queryParams()['sort']);
        this.filters.group.reset(this.queryParams()['filters']);
      } else {
        this._persistOnUrl({ replaceUrl: true });
      }
    }

    onQueryParamHashChange();

    toObservable(this.queryParamHash).pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
      distinctUntilChanged(),
    ).subscribe(hash => {
      logger(`Query param hash change received. Has hash?`, !!hash);
      onQueryParamHashChange();
    });

    setTimeout(() => this.submit());
  }

  private _initDefault() {
    this.change$.pipe(
      takeUntilDestroyed(this._inject(DestroyRef)),
    ).subscribe(change => {
      logger(`List change received from "${change?.name}". Must submit?`, !!change?.mustSubmit);

      if (change?.mustSubmit) {
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
      this.limit.set(limit === 9999999 ? this.limit() : limit);
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

  cancelRequests() {
    for (const request of this.getRequests()) {
      request.cancel();
    }
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
    const scrollTopOriginalValue = this._options.scrollToTop;
    this._options.scrollToTop = false;

    this.unselectAll();
    this.submit();

    this._options.scrollToTop = scrollTopOriginalValue;
  }
}
