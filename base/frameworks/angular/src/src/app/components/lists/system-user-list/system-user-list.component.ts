import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from '../../../core/features/list/list.module';
import { SystemUserActionGroupComponent } from '../../action-groups/system-user-action-group/system-user-action-group.component';
import { AbstractListComponent } from '../../../core/components/lists/abstract-list.component';

@Component({
  selector: 'app-system-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ListModule,
    SystemUserActionGroupComponent,
  ],
  templateUrl: './system-user-list.component.html',
  styleUrl: './system-user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserListComponent extends AbstractListComponent {

}
