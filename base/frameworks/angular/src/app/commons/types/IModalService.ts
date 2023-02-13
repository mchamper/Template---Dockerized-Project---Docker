import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

export interface IModalService {

  modal: NzModalRef;
  nzModalS: NzModalService;

  /* -------------------- */

  open: (...params: unknown[]) => void;
  close: (...params: unknown[]) => void;
}
