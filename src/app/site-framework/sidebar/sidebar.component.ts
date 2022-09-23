import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../products/products.service';
import { SiteFrameworkService } from '../site-framework.service';

@Component({
  selector: 'app-menu',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isHidden!: boolean;
  Data: any[] = [];

  constructor (private productsService: ProductsService, private siteFrameworkService: SiteFrameworkService) {
    this.siteFrameworkService.config.subscribe((v: any) => {
      if (v) {
        setTimeout(() => {
          this.isHidden = v.layout.sidebar.hidden;
        }, 0);

      }
    });
  }

  private generatedId = 0;




  ngOnInit(): void {
    this.productsService.getCategories().subscribe((data: any[]) => {
      this.Data = [...data];
    });
  }

}
