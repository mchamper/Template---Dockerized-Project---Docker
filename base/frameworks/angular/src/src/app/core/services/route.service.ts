import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRouteSnapshot, ActivationEnd, ActivationStart, Scroll, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TRouteData } from '../types/route-data.type';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  current: {
    url: WritableSignal<string>,
    snapshot: WritableSignal<ActivatedRouteSnapshot>,
    state: WritableSignal<{ [key: string]: any } | undefined>,
    queryParams: WritableSignal<Params>,
    params: WritableSignal<Params>,
    data: Signal<TRouteData>,
  } = {
    url: signal(''),
    snapshot: signal(this._getSnapshot()),
    state: signal(this._router.getCurrentNavigation()?.extras.state),
    queryParams: signal(this._route.snapshot.queryParams),
    params: signal(this._route.snapshot.params),
    data: computed(() => this.current.snapshot().data as TRouteData),
  };

  constructor() {
    this.onNavigationStart$().subscribe(value => {
      this.current.url.set(value.url);
    });

    this.onActivationEnd$().subscribe(value => {
      this.current.snapshot.set(this._getSnapshot(value));
      this.current.state.set(this._router.getCurrentNavigation()?.extras.state);
    });

    this._route.queryParams.subscribe(value => {
      this.current.queryParams.set(value);
    });

    this._route.params.subscribe(value => {
      this.current.params.set(value);
    });
  }

  /* -------------------- */

  private _getSnapshot(snapshot?: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    if (!snapshot) {
      snapshot = this._route.snapshot.root;
    }

    while (!!snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }

    return snapshot;
  }

  /* -------------------- */

  onNavigationStart$(): Observable<NavigationStart> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof NavigationStart)
    );
  }

  onNavigationEnd$(): Observable<NavigationEnd> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    );
  }

  onScrollEvent$(): Observable<Scroll> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof Scroll)
    );
  }

  /* -------------------- */

  onActivationStart$(name?: string): Observable<ActivatedRouteSnapshot> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof ActivationStart),
      filter((event: ActivationStart) => event.snapshot.firstChild === null),
      filter((event: ActivationStart) => !name || event.snapshot.data['name'] === name),
      map((event: ActivationStart) => this._getSnapshot(event.snapshot.root))
    );
  }

  onActivationEnd$(name?: string): Observable<ActivatedRouteSnapshot> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      filter((event: ActivationEnd) => !name || event.snapshot.data['name'] === name),
      map((event: ActivationEnd) => this._getSnapshot(event.snapshot.root))
    );
  }
}
