import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-AppMain',
  templateUrl: './AppMain.component.html',
  styleUrls: ['./AppMain.component.css'],
  animations: [
    trigger('submenu', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppMainComponent implements OnInit {

  public menuInactiveDesktop!: boolean;
  public menuActiveMobile!: boolean;
  public profileActive!: boolean;
  public topMenuActive!: boolean;
  public topMenuLeaving!: boolean;
  documentClickListener!: () => void;
  menuClick!: boolean;
  topMenuButtonClick!: boolean;
  configActive!: boolean;
  configClick!: boolean;

  constructor (public renderer: Renderer2, private primengConfig: PrimeNGConfig, public app: AppComponent) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  ngAfterViewInit() {
    // hides the overlay menu and top menu if outside is clicked
    this.documentClickListener = this.renderer.listen('body', 'click', (event) => {
      if (!this.isDesktop()) {
        if (!this.menuClick) {
          this.menuActiveMobile = false;
        }

        if (!this.topMenuButtonClick) {
          this.hideTopMenu();
        }
      }
      else {
        if (!this.menuClick && this.isOVerlay()) {
          this.menuInactiveDesktop = true;
        }
      }

      if (this.configActive && !this.configClick) {
        this.configActive = false;
      }

      this.configClick = false;
      this.menuClick = false;
      this.topMenuButtonClick = false;
    });
  }

  /**
   * Toggles menu
   * @param event 
   */
  toggleMenu(event: Event) {
    this.menuClick = true;
    if (this.isDesktop()) {
      this.menuInactiveDesktop = !this.menuInactiveDesktop;
      if (this.menuInactiveDesktop) {
        this.menuActiveMobile = false;
      }
    } else {
      this.menuActiveMobile = !this.menuActiveMobile;
      if (this.menuActiveMobile) {
        this.menuInactiveDesktop = false;
      }
    }

    if (this.topMenuActive) {
      this.hideTopMenu();
    }

    event.preventDefault();
  }

  /**
   * Toggles profile
   * @param event 
   */
  toggleProfile(event: Event) {
    this.profileActive = !this.profileActive;
    event.preventDefault();
  }

  /**
   * Toggles top menu
   * @param event 
   */
  toggleTopMenu(event: Event) {
    this.topMenuButtonClick = true;
    this.menuActiveMobile = false;

    if (this.topMenuActive) {
      this.hideTopMenu();
    } else {
      this.topMenuActive = true;
    }

    event.preventDefault();
  }

  /**
   * Hides top menu
   */
  hideTopMenu() {
    this.topMenuLeaving = true;
    setTimeout(() => {
      this.topMenuActive = false;
      this.topMenuLeaving = false;
    }, 500);
  }

  /**
   * Determines whether menu click on
   */
  onMenuClick() {
    this.menuClick = true;
  }

  /**
   * Determines whether ripple change on
   * @param event 
   */
  onRippleChange(event: { checked: boolean; }) {
    this.app.ripple = event.checked;
    this.primengConfig.ripple = event.checked;
  }

  /**
   * Determines whether config click on
   * @param event 
   */
  onConfigClick(event: any) {
    this.configClick = true;
  }

  /**
   * Determines whether static is
   * @returns  
   */
  isStatic() {
    return this.app.menuMode === 'static';
  }

  /**
   * Determines whether overlay is
   * @returns  
   */
  isOVerlay() {
    return this.app.menuMode === 'overlay';
  }

  /**
   * Determines whether desktop is
   * @returns  
   */
  isDesktop() {
    return window.innerWidth > 1024;
  }

  /**
   * Determines whether search click on
   */
  onSearchClick() {
    this.topMenuButtonClick = true;
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }
}
