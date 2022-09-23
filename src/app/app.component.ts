import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { SiteFrameworkService } from './site-framework/site-framework.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private history: any[] = [];
  isHidden!: boolean;

  // @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor (private router: Router,
    private location: Location,
    private siteFrameworkService: SiteFrameworkService,
    private observer: BreakpointObserver,
    private ref: ChangeDetectorRef,
    private primengConfig: PrimeNGConfig
  ) {





    // https://www.tektutorialshub.com/angular/angular-location-service/
    // console.log(this.location.getState());
    this.loadRouting();
    this.siteFrameworkService.config.subscribe((v: any) => {
      if (v) {
        setTimeout(() => {
          // console.log(v);
          this.isHidden = v.layout.sidebar.hidden;
        }, 0);

      }
    });
  }

  /**
   * Get History State Object
   */
  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => {
        // console.log(event);
        return event instanceof NavigationEnd;
      }))
      .subscribe((urlAfterRedirects) => {
        this.history = [...this.history, urlAfterRedirects];
        // console.log(this.history);
      });
  }




  menuMode = 'static';

  lightMenu = false;

  inputStyle = 'outlined';

  ripple!: boolean;




  ngOnInit() {
    this.primengConfig.ripple = true;
    this.ripple = true;

    console.log(window.location.href);
    let z = this.justNumbers(window.location.href);
    console.log(z);
  }

  justNumbers(string: string) {
    var numsStr = string.replace(/[^0-9]/g, '');
    return parseInt(numsStr);
  }

}
