import { AbstractModel } from "./abstract-model";
import { map, Observable } from "rxjs";

export type TQualificationStatus =
  | 'APPROVED'
  | 'NOT_APPROVED'
  | 'NEED_APPLICANT'
  | 'INFO_ERROR'
  | 'ERROR'
  ;

export interface IQualification {
  applicantName: string;
  status: TQualificationStatus;
}

export class Qualification extends AbstractModel<IQualification> {

  /* -------------------- */

  public isStatus(status: TQualificationStatus): boolean {
    return this.data.status === status;
  }
  public isStatus$(status: TQualificationStatus): Observable<boolean> {
    return this.subject$.pipe(map(() => this.isStatus(status)));
  }

  public isApproved(): boolean {
    return this.data.status === 'APPROVED';
  }
  public isApproved$(): Observable<boolean> {
    return this.subject$.pipe(map(() => this.isApproved()));
  }

  public isNotApproved(): boolean {
    return this.data.status === 'NOT_APPROVED';
  }
  public isNotApproved$(): Observable<boolean> {
    return this.subject$.pipe(map(() => this.isNotApproved()));
  }

  public isNeedApplicant(): boolean {
    return this.data.status === 'NEED_APPLICANT';
  }
  public isNeedApplicant$(): Observable<boolean> {
    return this.subject$.pipe(map(() => this.isNeedApplicant()));
  }

  public isInfoError(): boolean {
    return this.data.status === 'INFO_ERROR';
  }
  public isInfoError$(): Observable<boolean> {
    return this.subject$.pipe(map(() => this.isInfoError()));
  }

  public isError(): boolean {
    return this.data.status === 'ERROR';
  }
  public isError$(): Observable<boolean> {
    return this.subject$.pipe(map(() => this.isError()));
  }
}
