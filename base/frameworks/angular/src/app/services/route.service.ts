import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRouteSnapshot, ActivationEnd, ActivationStart, Scroll, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  currentPage$: BehaviorSubject<any> = new BehaviorSubject(this.getSnapshotLastChild().data);

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  ) {

    this.onActivationStart$().subscribe(snapshot => {
      this.currentPage$.next(snapshot.data);
    });
  }

  /* -------------------- */

  isCurrentPage(name: string | string[]): boolean {
    let names: string[];

    Array.isArray(name)
      ? names = name
      : names = [name];

    return names.includes(this.currentPage$.value?.name);
  }
  isCurrentPage$(name: string | string[]): Observable<boolean> {
    return this.currentPage$.pipe(map(() => this.isCurrentPage(name)));
  }

  /* -------------------- */

  getSnapshotLastChild(snapshot?: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    if (!snapshot) {
      snapshot = this._route.snapshot.root;
    }

    const groupNames: string[] = [];
    let params: any = {};

    while (snapshot.firstChild !== null) {
      if (snapshot.data['groupName'] && !groupNames.find(item => item === snapshot?.data['groupName'])) {
        groupNames.push(snapshot.data['groupName']);
      }

      params = {
        ...params,
        ...snapshot.params
      };

      snapshot = snapshot.firstChild;
    }

    snapshot.data = {
      ...snapshot.data,
      groupNames: groupNames,
      params: params
    };

    delete snapshot.data['groupName'];

    return snapshot;
  }

  /* -------------------- */

  onNavigationStart$(): Observable<any> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof NavigationStart)
    );
  }

  onNavigationEnd$(): Observable<any> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    );
  }

  onScrollEvent$(): Observable<any> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof Scroll)
    );
  }

  /* -------------------- */

  onActivationStart$(name?: string): Observable<ActivatedRouteSnapshot> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof ActivationStart),
      filter((event: ActivationStart) => event.snapshot.firstChild === null),
      filter((event: ActivationStart) =>  {
        if (name) {
          return event.snapshot.data['name'] === name;
        }

        return true;
      }),
      map((event: ActivationStart) => this.getSnapshotLastChild(event.snapshot.root))
    );
  }

  onActivationEnd$(name?: string): Observable<ActivatedRouteSnapshot> {
    return this._router.events.pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      filter((event: ActivationEnd) =>  {
        if (name) {
          return event.snapshot.data['name'] === name;
        }

        return true;
      }),
      map((event: ActivationEnd) => this.getSnapshotLastChild(event.snapshot.root))
    );
  }
}
