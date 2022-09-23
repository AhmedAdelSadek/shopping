import { Component, OnInit } from '@angular/core';
import { SiteFrameworkService } from '../site-framework.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isHidden!: boolean;
  
  constructor(private siteFrameworkService: SiteFrameworkService) { 
    this.siteFrameworkService.config.subscribe((v: any) => {
      if (v) {
        setTimeout(() => {
          // console.log(v);
          this.isHidden = v.layout.sidebar.hidden;
        }, 0);

      }
    });
  }

  ngOnInit(): void {
  }

}
