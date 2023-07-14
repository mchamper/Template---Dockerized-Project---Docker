import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Request } from '../../request';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent implements OnInit {

  @Input({ required: true }) request!: Request;
  @Input() type!: 'default' | 'form' | 'spinner';
  @Input() spinnerSize: number = 1.5;
  @Input() minHeight!: string;

  @ContentChild('content') contentTpl!: TemplateRef<any>;
  @ContentChild('placeholder') placeholderTpl!: TemplateRef<any>;
  @ContentChild('loading') loadingTpl!: TemplateRef<any>;
  @ContentChild('success') successTpl!: TemplateRef<any>;
  @ContentChild('error') errorTpl!: TemplateRef<any>;

  get isLoading(): boolean {
    return this.request.isLoading() && !this.placeholderTpl;
  }

  get mustDisableInteraction(): boolean {
    return this.isLoading || this.request.isError();
  }

  ngOnInit(): void {
    if (!this.type) {
      this.type = this.request.type;
    }

    if (typeof this.minHeight === 'undefined') {
      this.minHeight = this.spinnerSize + 'rem';
    }
  }
}
