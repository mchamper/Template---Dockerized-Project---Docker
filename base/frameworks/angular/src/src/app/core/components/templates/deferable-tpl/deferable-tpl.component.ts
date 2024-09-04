import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-deferable-tpl',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './deferable-tpl.component.html',
  styleUrl: './deferable-tpl.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeferableTplComponent {

}
