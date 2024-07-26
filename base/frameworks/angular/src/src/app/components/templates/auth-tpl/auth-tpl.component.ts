import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { versionName } from '../../../../version';

@Component({
  selector: 'app-auth-tpl',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './auth-tpl.component.html',
  styleUrl: './auth-tpl.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthTplComponent {

  get footerText(): string {
    return `v${versionName}`;
  }
}
