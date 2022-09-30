import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { IProduct } from '../../models/IProduct';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  productId = 0;
  productDetails!: IProduct;
  constructor (
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data: any) => {
      this.productId = data.id;

      this.productsService.viewProduct(this.productId).subscribe(productData => {
        if (productData && productData.id) {
          this.productDetails = productData; // get the existing data of the product
        }
      });
    });
  }
  /**
   * Updates product
   * @param form
   */
  updateProduct(form: { value: IProduct; }) {
    const updateProduct: IProduct = {
      id: +form.value.id,
      categoryId: form.value.categoryId ? +form.value.categoryId : this.productDetails.categoryId,
      productName: form.value.productName ? form.value.productName : this.productDetails.productName,
      description: form.value.description ? form.value.description : this.productDetails.description,
      productImg: this.productDetails.productImg,
      price: form.value.price ? +form.value.price : this.productDetails.price,
      isAvailable: form.value.isAvailable == 'true' as any ? true : form.value.isAvailable == 'false' as any ? false : this.productDetails.isAvailable,
      rating: form.value.rating ? +form.value.rating : this.productDetails.rating,
      quantity: +form.value.quantity
    };

    this.productsService.updateProduct(this.productId, updateProduct).subscribe(data => {
      console.log(data);
      this._router.navigateByUrl(`products`);
    });

  }

}
