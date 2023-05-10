import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestHandler } from '../../request-handler';
import { NzResultModule } from 'ng-zorro-antd/result';
import { Form } from 'src/app/utils/form/form';
import { List } from 'src/app/utils/list/list';

@Component({
  selector: 'app-request-handler',
  standalone: true,
  imports: [
    CommonModule,
    NzResultModule
  ],
  templateUrl: './request-handler.component.html',
  styleUrls: ['./request-handler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestHandlerComponent implements OnInit {

  @Input() requestH!: RequestHandler;
  @Input() form!: Form;
  @Input() list!: List;
  @Input() listAction!: Form;
  @Input() type: 'data' | 'form' | 'listAction' | 'button' | 'loading' = 'data';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() errorInfo: boolean = true;

  @ContentChild('loadingTpl') loadingTpl!: TemplateRef<any>;
  @ContentChild('errorTpl') errorTpl!: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
    if (this.form) {
      this.requestH = this.form.requestH;
      this.type = 'form';
    }
    else if (this.list) {
      this.requestH = this.list.requestH;
      this.type = 'data';
    }
    else if (this.listAction) {
      this.requestH = this.listAction.requestH;
      this.type = 'listAction';
    }
  }

}
