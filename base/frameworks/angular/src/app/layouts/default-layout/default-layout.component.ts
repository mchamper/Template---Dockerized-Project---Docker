import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from 'src/app/components/layouts/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/layouts/footer/footer.component';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
