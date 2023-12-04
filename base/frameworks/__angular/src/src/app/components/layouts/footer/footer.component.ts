import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { versionName } from 'src/version';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  get footerText(): string {
    return `v${versionName}`;
  }
}
