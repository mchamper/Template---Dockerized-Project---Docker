import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AppService } from '../../../core/services/app.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  imports: [
    CommonModule,
    NzResultModule,
    NzAlertModule,
  ],
  templateUrl: './forbidden-page.component.html',
  styleUrls: ['./forbidden-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForbiddenPageComponent {

  appS = inject(AppService);
}
