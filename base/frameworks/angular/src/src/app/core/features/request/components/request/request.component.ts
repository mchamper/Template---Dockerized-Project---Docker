import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Request } from '../../request.class';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent {

  @Input() request!: Request;
  @Input() requests: Request[] = [];
  @Input() type!: 'default' | 'form' | 'spinner' | 'input';
  @Input() layer: boolean = true;
  @Input() spinnerSize: number = 1.5;
  @Input() minHeight!: string;

  @ContentChild('bodyTpl') bodyTpl!: TemplateRef<any>;
  @ContentChild('placeholderTpl') placeholderTpl!: TemplateRef<any>;
  @ContentChild('loadingTpl') loadingTpl!: TemplateRef<any>;
  @ContentChild('successTpl') successTpl!: TemplateRef<any>;
  @ContentChild('errorTpl') errorTpl!: TemplateRef<any>;

  get isLoading(): boolean {
    return this.request.isLoading() && !this.placeholderTpl;
  }

  get mustDisableInteraction(): boolean {
    return this.isLoading || this.request.hasError();
  }

  ngOnInit(): void {
    if (!this.type) {
      this.type = this.request?.type;
    }

    if (this.type === 'input') {
      this.spinnerSize = this.spinnerSize * 0.75;
    }

    if (typeof this.minHeight === 'undefined') {
      this.minHeight = this.spinnerSize + 'rem';
    }
  }
}
