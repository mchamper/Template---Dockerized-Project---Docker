import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Form } from 'src/app/commons/form';
import { List } from 'src/app/commons/list';
import { SubscriptionManager } from 'src/app/commons/subscription-manager';
import { stringToObject } from 'src/app/helper';
import { IHttpErrorResponse } from 'src/app/interceptors/error.interceptor';
import { CombosHttpService } from 'src/app/services/http/combos-http.service';
import { UserMarketTokenHttpService } from 'src/app/services/http/user-market-token-http.service';

@Component({
  selector: 'app-award-list-page',
  templateUrl: './award-list-page.component.html',
  styleUrls: ['./award-list-page.component.scss']
})
export class AwardListPageComponent implements OnInit, OnDestroy {

  awardList: List<any>;

  private _sm: SubscriptionManager = new SubscriptionManager();

  constructor(
    private _userMarketTokenHttpS: UserMarketTokenHttpService,
    private _combosHttpS: CombosHttpService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _message: NzMessageService,
    private _fb: FormBuilder,
  ) {

    this.awardList = new List('LaravelPage');

    this.awardList.filtersForm = new Form(this._fb.group({
      userWalletNotNull: [false],
      userWalletNull: [false],
      wheelSpinDataNull: [false],
      userName: [''],
      userEmail: [''],
      userWallet: [''],
      approvalStatus: [[]],
      mintStatus: [[]],
      transactionStatus: [[]],
      type: [[]],
    }));
  }

  ngOnInit(): void {
    this.getCombos();

    this._sm.add(this.awardList.initNg({ action: this.getAwards }, {
      router: this._router,
      route: this._route,
    }));
  }

  ngOnDestroy(): void {
    this._sm.clean();
  }

  /* -------------------- */

  getCombos() {
    if (this.awardList.filtersForm.combosRequest.isLoading()) return;

    this._sm.add(
      this.awardList.filtersForm.combosRequest.send(this._combosHttpS.get(
        'user_market_token_statuses:without_minted,user_market_token_types'
      )).subscribe({
        next: (res: any) => {
          this.awardList.filtersForm.combos = {
            user_market_token_approval_statuses: [
              { id: 1, name: 'Pending', value: 'null' },
              { id: 2, name: 'Approved', value: 1 },
              { id: 3, name: 'Rejected', value: 0 },
            ],
            user_market_token_transaction_statuses: [
              { id: 1, name: 'Not found', value: 'null' },
              { id: 2, name: 'Success', value: 1 },
              { id: 3, name: 'Fail', value: 0 },
            ],
            ...res.body.combos,
          };
        },
        error: (err: IHttpErrorResponse) => this._message.error(err.message),
      })
    , 'getCombos');
  }

  getAwards = (page: number = 1, reset?: boolean) => {
    if (this.awardList.request.isLoading()) return;
    if (reset) this.awardList.reset();

    const filters = {
      'filters.status_id|!eq': 1,
      /* -------------------- */
      'filters.user|has.advFilters._groupA:or.wallet|!null': this.awardList.filtersForm.getValue('userWalletNotNull'),
      'filters.user|has.advFilters._groupA:or.wallet|null': this.awardList.filtersForm.getValue('userWalletNull'),
      'filters.wheel_spin_data|null': this.awardList.filtersForm.getValue('wheelSpinDataNull'),
      'filters.user|has.filters.profile_default|has.filters.nombre|-like-': this.awardList.filtersForm.getValue('userName'),
      'filters.user|has.filters.profile_default|has.filters.email|-like-': this.awardList.filtersForm.getValue('userEmail'),
      'filters.user|has.filters.profile_default|has.filters.wallet|-like-': this.awardList.filtersForm.getValue('userWallet'),

      'advFilters._groupA:or.approval_status|in': this.awardList.filtersForm.getValue('approvalStatus')?.filter((item: any) => item !== 'null').join(','),
      'advFilters._groupA:or.approval_status|null': this.awardList.filtersForm.getValue('approvalStatus')?.find((item: any) => item === 'null') ? true : false,
      'advFilters._groupB:or.transaction_status|in': this.awardList.filtersForm.getValue('transactionStatus')?.filter((item: any) => item !== 'null').join(','),
      'advFilters._groupB:or.transaction_status|null': this.awardList.filtersForm.getValue('transactionStatus')?.find((item: any) => item === 'null') ? true : false,

      'filters.status_id|in': this.awardList.filtersForm.getValue('mintStatus')?.join(','),
      'filters.type_id|in': this.awardList.filtersForm.getValue('type')?.join(','),
    };

    const params = {
      page,
      limit: this.awardList.limit,
      sort: this.awardList.sort || '-created_at',
      with: 'user.profile_default,type,status,approval_status_by',
      extras: 'nbl_to_approve,nbl_to_transfer,nbl_in_wallet,stardust_to_approve,stardust_to_transfer,stardust_in_wallet',
      ...stringToObject(filters, true),
    };

    this._sm.add(
      this.awardList.request.send(this._userMarketTokenHttpS.getList(params)).subscribe({
        next: (res: any) => this.awardList.set(res.body.user_market_tokens, { extras: res.body.user_market_token_extras }),
        error: (err: IHttpErrorResponse) => this._message.error(err.message),
      })
    , 'getAwards');
  }
}
