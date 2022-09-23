import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { Form } from 'src/app/commons/form';
import { SubscriptionManager } from 'src/app/commons/subscription-manager';
import { IHttpErrorResponse } from 'src/app/interceptors/error.interceptor';
import { CombosHttpService } from 'src/app/services/http/combos-http.service';
import { ICallback } from 'src/app/types/callback.interface';
import { differenceInCalendarDays } from 'date-fns';
import { RankingWeeklyHttpService } from 'src/app/services/http/ranking-weekly-http.service';

@Component({
  selector: 'app-ranking-weekly-save-action',
  templateUrl: './ranking-weekly-save-action.component.html',
  styleUrls: ['./ranking-weekly-save-action.component.scss']
})
export class RankingWeeklySaveActionComponent implements OnInit, OnDestroy {

  @ViewChild('modal') modal!: NzModalComponent;

  @Input() onSuccessCb?: ICallback;

  weeklyId?: number;
  form: Form;

  disabledDate;

  private _sm: SubscriptionManager = new SubscriptionManager();

  constructor(
    private _combosHttpS: CombosHttpService,
    private _rankingWeeklyHttpS: RankingWeeklyHttpService,
    private _message: NzMessageService,
    private _fb: FormBuilder,
  ) {

    this.disabledDate = (current: Date): boolean => {
      return differenceInCalendarDays(moment().toDate(), current) > 0;
    };

    this.form = new Form(this._fb.group({
      name: [null],
      date: [''],
      prizes: this._fb.array([]),
    }), {
      onInit: (form) => {
        form.group.get('date')?.valueChanges.subscribe((value: Date[]) => {
          value[0]?.setMinutes(0, 0);
          value[1]?.setMinutes(0, 0);
        });

        if (form.state.get()?.prizes?.length > 0) {
          for (const prize of form.state.get().prizes) {
            form.add('prizes');
          }
        }
      },
      arrays: {
        prizes: {
          group: this._fb.group({
            positions: [null],
            type_combo: [null],
            type: [null],
            value: [1],
          }),
          onAdd: (group: FormGroup) => {
            group.get('type_combo')?.valueChanges.subscribe(() => {
              group.get('type')?.setValue(null);
              group.get('value')?.setValue(1);
            });
          }
        }
      },
    });
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    this._sm.clean();
  }

  /* -------------------- */

  open(weeklyId?: number): void {
    this._sm.clean();

    this.weeklyId = weeklyId;

    this.form.restore(true);

    this.getCombos();
    this.getWeekly();

    this.modal.open();
  }

  close(): void {
    this.modal.close();
    this._sm.clean();
  }

  /* -------------------- */

  getCombos() {
    if (this.form.combosRequest.isLoading()) return;

    this._sm.add(
      this.form.combosRequest.send(this._combosHttpS.get(
        'user_asset_types,user_asset_combos,user_market_token_types'
      )).subscribe({
        next: (res: any) => {
          this.form.combos = {
            ...res.body.combos,
          };
        },
        error: (err: IHttpErrorResponse) => this._message.error(err.message),
      })
    , 'getCombos');
  }

  getWeekly() {
    if (!this.weeklyId) return;
    if (this.form.dataRequest.isLoading()) return;

    this._sm.add(
      this.form.dataRequest.send(this._rankingWeeklyHttpS.getDetail(this.weeklyId)).subscribe({
        next: (res: any) => {
          const weekly = res.body.ranking_custom_weekly_config;

          weekly.date = [
            moment(weekly.from).toDate(),
            moment(weekly.to).toDate(),
          ];

          if (weekly.prizes) {
            for (const prize of weekly.prizes) {
              if (prize.type.startsWith('asset_')) {
                prize.type_combo = 'user_asset_types';
              }
              else if (prize.type.startsWith('combo_')) {
                prize.type_combo = 'user_asset_combos';
              }
              else if (prize.type.startsWith('token_')) {
                prize.type_combo = 'user_market_token_types';
              }
            }
          }

          this.form.set(weekly);
        },
        error: (err: IHttpErrorResponse) => this._message.error(err.message),
      })
    , 'getWeekly');
  }

  /* -------------------- */

  save(): void {
    if (this.form.request.isLoading()) return;

    this.form.resetErrors();

    const input = {
      ...this.form.group.value,
      date: [
        moment(this.form.group.value.date[0]).toLocaleString(),
        moment(this.form.group.value.date[1]).toLocaleString(),
      ],
    };

    const method = this.weeklyId
      ? this._rankingWeeklyHttpS.update(this.weeklyId, input)
      : this._rankingWeeklyHttpS.create(input);

    this._sm.add(
      this.form.dataRequest.send(method).subscribe({
        next: (res: any) => {
          this.close();
          this.onSuccessCb?.action(...(this.onSuccessCb.params || []));
        },
        error: (err: IHttpErrorResponse) => {
          this._message.error(err.message);
          this.form.setErrors(err.errors);
        },
      })
    );
  }
}
