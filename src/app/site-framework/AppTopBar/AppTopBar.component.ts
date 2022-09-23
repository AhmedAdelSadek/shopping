import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AppMainComponent } from 'src/app/products/AppMain/AppMain.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './AppTopBar.component.html',
  styleUrls: ['./AppTopBar.component.css']
})
export class AppTopBarComponent implements OnInit {

  constructor (public app: AppComponent, public appMain: AppMainComponent) { }

  ngOnInit() {
  }

}
