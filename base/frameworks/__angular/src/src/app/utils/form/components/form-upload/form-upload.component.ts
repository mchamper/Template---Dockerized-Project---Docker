import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzUploadFile, NzUploadListType, NzUploadModule, NzUploadType, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { UploadHttpService } from 'src/app/services/http/upload-http.service';
import { Observable, Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IHttpErrorResponse } from 'src/app/interceptors/error.interceptor';
import { FormControlDirective } from '../../directives/form-control.directive';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { isArray } from 'lodash';
import { RequestComponent } from 'src/app/utils/request/components/request/request.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form-upload',
  standalone: true,
  imports: [
    CommonModule,
    NzUploadModule,
    NzIconModule,
    ReactiveFormsModule,
    FormControlDirective,
    NzInputModule,
    NzFormModule,
    RequestComponent
  ],
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormUploadComponent implements OnInit {

  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) concept!: string;
  @Input() type: 'avatar' | 'button' | 'input' | 'dropzone' = 'button';
  @Input() listTipe: NzUploadListType = 'text';
  @Input() max: number = 10;

  fileList = signal<NzUploadFile[]>([]);
  multiple = false;

  private _destroyRef = inject(DestroyRef);

  constructor(
    private _uploadHttpS: UploadHttpService,
  ) { }

  get nzFileList(): NzUploadFile[] {
    return this.fileList();
  }

  set nzFileList(value: any) {
    this.fileList.set(value);
  }

  get nzType(): NzUploadType {
    // return this.type === 'dropzone' ? 'drag' : 'select';
    return 'select';
  }

  /* -------------------- */

  ngOnInit(): void {
    this.multiple = isArray(this.control.value);

    if (this.type === 'avatar' || (this.type === 'dropzone' && !this.multiple)) {
      this.listTipe = 'picture-card';
    }

    if (!this.multiple) {
      this.max = 1;
    }

    const onControlChange = (value: any) => {
      if ((isArray(value) && value.length) || value) {
        this.multiple
          ? this.fileList.set((value as any[]).map(item => this.getFileItem(item)))
          : this.fileList.set([this.getFileItem(value)]);
      } else {
        this.fileList.set([]);
      }
    }

    onControlChange(this.control.value);
    this.control.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(value => onControlChange(value));
  }

  /* -------------------- */

  getFileItem(value: any): NzUploadFile {
    return {
      uid: value.uuid,
      name: value.file_name,
      status: 'done',
      url: value.original_url,
      thumbUrl: value.preview_url,
      response: { ...value },
    }
  }

  getFileItemWithError(value: any, errorMessage: string): NzUploadFile {
    return {
      ...value,
      status: 'error',
      response: errorMessage,
    }
  }

  updateFileItem(value: any, file: NzUploadFile, errorMessage?: string): void {
    this.fileList.update(fileListValue => {
      return [
        ...fileListValue.map(item => {
          if (item.uid === file.uid) {
            return !errorMessage
              ? this.getFileItem(value)
              : this.getFileItemWithError(item, errorMessage);
          }

          return item;
        }),
      ];
    });
  }

  /* -------------------- */

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    return this.nzFileList.length < this.max;
  }

  upload = (item: NzUploadXHRArgs): Subscription => {
    if (!this.multiple) {
      //
    }

    const input = new FormData();
    input.append('file', item.file as any);

    return this._uploadHttpS.upload(this.concept, input).subscribe({
      next: (res: any) => {
        this.updateFileItem(res.body.file, item.file);
        this.addControlValue(res.body.file);
      },
      error: (err: IHttpErrorResponse) => {
        this.updateFileItem(null, item.file, err.message);
      },
    });
  }

  remove = (file: NzUploadFile): boolean | Observable<boolean> => {
    this.removeControlValue(file.response);
    return true;
  }

  /* -------------------- */

  setControlValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
    this.control.markAsDirty();
    this.control.updateValueAndValidity();
  }

  addControlValue(value: any): void {
    if (this.multiple) {
      this.setControlValue([
        ...this.control.value,
        value,
      ]);

      return;
    }

    this.setControlValue(value);
  }

  removeControlValue(value: any): void {
    if (this.multiple) {
      this.setControlValue([
        ...this.control.value.filter((item: any) => item.id !== value.id),
      ]);

      return;
    }

    this.setControlValue(null);
  }
}
