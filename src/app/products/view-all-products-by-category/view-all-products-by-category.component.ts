import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../models/IProduct';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-view-all-products-by-category',
  templateUrl: './view-all-products-by-category.component.html',
  styleUrls: ['./view-all-products-by-category.component.css']
})
export class ViewAllProductsByCategoryComponent implements OnInit {
  searchCategory!: string;
  productList!: IProduct[];

  constructor (
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private _router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data: any) => {
      this.searchCategory = data.id;
      this.productsService.searchCategoryProducts(this.searchCategory).subscribe(categoryData => {
        this.productList = categoryData;
        console.log(this.productList);
      });
    });
  }

  routing(id: number) {
    // this._router.navigate([`products/product/${id}`]);
    // or
    this._router.navigateByUrl(`products/product/${id}`);
  }

}
