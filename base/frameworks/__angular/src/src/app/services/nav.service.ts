import { Location } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(
    public location: Location,
  ) { }

  /* -------------------- */

  back(): void {
    this.location.back();
  }
}
