import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-user-update-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-user-update-page.component.html',
  styleUrl: './system-user-update-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUserUpdatePageComponent {

}
