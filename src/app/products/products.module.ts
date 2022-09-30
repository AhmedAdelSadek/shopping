import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AngularMaterialModule } from "src/material.module";
import { PrimengModule } from "src/primeng.module";
import { SiteFrameworkModule } from "../site-framework/site-framework.module";

import { CartDetailComponent } from "./cartDetail/cartDetail.component";

import { CreateProductComponent } from "./create-product/create-product.component";
import { DeleteProductComponent } from "./delete-product/delete-product.component";
import { ProductsComponent } from "./products.component";
import { ProductsService } from "./products.service";
import { UpdateProductComponent } from "./update-product/update-product.component";
import { ViewAllProductsByCategoryComponent } from "./view-all-products-by-category/view-all-products-by-category.component";
import { ViewAllProductsByDateComponent } from "./view-all-products-by-date/view-all-products-by-date.component";
import { ViewAllProductsComponent } from "./view-all-products/view-all-products.component";
import { ViewProductComponent } from "./view-product/view-product.component";

const routes: Routes = [
  { path: "", component: ViewAllProductsComponent },
  { path: "create-product", component: CreateProductComponent },
  { path: "category/:id", component: ViewAllProductsByCategoryComponent },
  { path: "search", component: ViewAllProductsByDateComponent },
  { path: "delete-product/:id", component: DeleteProductComponent },
  { path: "product/:id", component: ViewProductComponent },
  { path: "update-product/:id", component: UpdateProductComponent },
  { path: "cart", component: CartDetailComponent },
];

@NgModule({
  declarations: [
    ProductsComponent,
    CreateProductComponent,
    ViewProductComponent,
    ViewAllProductsComponent,
    UpdateProductComponent,
    DeleteProductComponent,
    ViewAllProductsByDateComponent,
    ViewAllProductsByCategoryComponent,
    CartDetailComponent,
  ],
  imports: [
    AngularMaterialModule,
    SiteFrameworkModule,
    FlexLayoutModule,
    PrimengModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  providers: [ProductsService],
})
export class ProductsModule {}
