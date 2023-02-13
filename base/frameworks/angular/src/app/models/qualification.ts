import { AbstractModel } from "./abstract-model";
import { map, Observable } from "rxjs";

export type TQualificationStatus =
  | 'APPROVED'
  | 'ALMOST_APPROVED'
  | 'NOT_APPROVED'
  | 'NEED_APPLICANT'
  | 'INFO_ERROR'
  | 'ERROR'
  ;

export interface IQualification {
  status: TQualificationStatus,
  applicantName: string,
  agent?: {
    name: string,
    pictureUrl?: string,
  },
}

export class Qualification extends AbstractModel<IQualification> {

  /* -------------------- */

  public isStatus(status: TQualificationStatus): boolean {
    return this.data.status === status;
  }
  public isStatus$(status: TQualificationStatus): Observable<boolean> {
    return this.subject$.pipe(map(() => this.isStatus(status)));
  }

  /* -------------------- */

  public hasAgent(): boolean {
    return !(['NOT_APPROVED', 'INFO_ERROR', 'ERROR'] as TQualificationStatus[]).includes(this.data.status)
      && !!this.data.agent;
  }
}
