import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

export interface IModalService {

  modal: NzModalRef;
  nzModalS: NzModalService;

  /* -------------------- */

  open: (...params: any[]) => void;
  close: (...params: any[]) => void;
}
