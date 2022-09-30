import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { PrimeNGConfig, SelectItem } from "primeng/api";
import { Product } from "src/app/models/Product";
import { SiteFrameworkService } from "src/app/site-framework/site-framework.service";
import { IProduct } from "../../models/IProduct";
import { CartDetailComponent } from "../cartDetail/cartDetail.component";
import { ProductsService } from "../products.service";

@Component({
  selector: "app-view-all-products",
  templateUrl: "./view-all-products.component.html",
  styleUrls: ["./view-all-products.component.scss"],
})
export class ViewAllProductsComponent implements OnInit, AfterViewInit {
  productList!: IProduct[];
  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  event!: HTMLTextAreaElement;
  sortKey: string = "";

  constructor(
    private productsService: ProductsService,
    private siteFrameworkService: SiteFrameworkService,
    private ref: ChangeDetectorRef,
    private primengConfig: PrimeNGConfig,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.productList = data;
        // console.log(data);
      },
      error: (error: Error) => {
        console.log(
          "%c ########### ERROR! ",
          "background: red; color: white",
          error
        );
      },
      complete: () => {
        setTimeout(() => {
          // console.log('%c ########### completed! ',
          //   'background: green; color: white');
        }, 2000);
      },
    });

    this.sortOptions = [
      { label: "Price High to Low", value: "!price" },
      { label: "Price Low to High", value: "price" },
    ];

    this.primengConfig.ripple = true;
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  trackByFn(index: number, item: any): string {
    return item ? item.title : undefined;
  }

  @ViewChild(CartDetailComponent, { static: true }) child!: CartDetailComponent;

  addProductToCart(product: Product) {
    this.productsService.onProductChange = product;
    this.router.navigateByUrl("products/cart");
  }
}
