import { distinctUntilChanged, Observable } from "rxjs";

export const distinctUntilDeeplyChanged = <T>() => {
  return (observable: Observable<T>): Observable<T> => {
    return observable.pipe(
      distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current))
    );
  }
}
