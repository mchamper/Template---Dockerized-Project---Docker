import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

interface NavPage {
  link: (...params: any) => string,
  params: (...params: any) => { [key: string]: any } | null,
  before: (...params: any) => void,
  nav: (...params: any) => Promise<boolean>,
  [key: string]: (...params: any) => any,
}

interface NavPages {
  AuthLoginPage: NavPage,
  HomePage: NavPage,
  UserPage: NavPage,
  AwardListPage: NavPage,
  MetricDailyRecordListPage: NavPage,
  MetricDauListPage: NavPage,
  MetricRetentionListPage: NavPage,
  RankingTournamentListPage: NavPage,
  RankingWeeklyListPage: NavPage,
  RankingMonthlyListPage: NavPage,
}

@Injectable({
  providedIn: 'root'
})
export class NavService {

  pages: NavPages = {
    AuthLoginPage: {
      link: () => `/auth/login`,
      params: () => null,
      before: () => null,
      nav: () => this.router.navigate([this.pages.AuthLoginPage.link()]),
    },
    HomePage: {
      link: () => `/home`,
      params: () => null,
      before: () => null,
      nav: () => this.router.navigate([this.pages.HomePage.link()]),
    },
  };

  constructor(
    public location: Location,
    public router: Router,
  ) { }

  /* -------------------- */

  back(): void {
    this.location.back();
  }
}
