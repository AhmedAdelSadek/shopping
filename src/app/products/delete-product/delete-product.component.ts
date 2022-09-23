import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit {
  productId = 0;
  constructor (
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data: any) => {
      this.productId = data?.id;
      console.log(this.productId);

      this.productsService.deleteProduct(this.productId).subscribe(deleteProductdata => {
        {
          console.log('Deleted product');
          console.log(deleteProductdata);
          // this._router.navigateByUrl(`products`);
          // window.location.reload();
        }
      });
    });
  }

}
