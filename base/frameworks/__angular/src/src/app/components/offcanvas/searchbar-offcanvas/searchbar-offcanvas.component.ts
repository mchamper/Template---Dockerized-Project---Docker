import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { SearchbarComponent } from '../../commons/searchbar/searchbar.component';
import { OffcanvasComponent } from '../offcanvas/offcanvas.component';

@Component({
  selector: 'app-searchbar-offcanvas',
  standalone: true,
  imports: [
    SharedModule,
    SearchbarComponent,
    OffcanvasComponent
  ],
  templateUrl: './searchbar-offcanvas.component.html',
  styleUrls: ['./searchbar-offcanvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchbarOffcanvasComponent {

}
