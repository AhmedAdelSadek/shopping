import { Component, OnDestroy, OnInit } from "@angular/core";
import { lastValueFrom, Observable, Subscription, switchMap } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { ICartLine } from "src/app/models/ICartLine";
import { IProduct } from "src/app/models/iproduct";
import { Product } from "src/app/models/Product";
import { untilDestroyed } from "src/app/shared/until-destroyed";
import { ProductsService } from "../products.service";

@Component({
  selector: "cartDetail",
  templateUrl: "./cartDetail.component.html",
  styleUrls: ["./cartDetail.component.css"],
})
export class CartDetailComponent implements OnInit, OnDestroy {
  public updatedData: ICartLine[] = [];
  public cartPrice: number = 0;
  public itemCount: number = 0;
  get productObj(): IProduct {
    return this.productServ.onProductChange;
  }

  constructor (private productServ: ProductsService) { }

  ngOnInit(): void {
    if (!this.isObjectEmpty(this.productObj)) {
      this.productServ.getCartLines().pipe(
        untilDestroyed(this),
        switchMap((data) => {
          this.updatedData = data;
          return this.sendPostOrPutAPI(this.updatedData);
        }))
        .subscribe();
    } else {
      this.getCartLines()
        .then((data) => {
          this.updatedData = data;
        })
        .catch((err) => console.error(err))
        .finally(() => this.recalculate());
    }
  }

  private async getCartLines(): Promise<ICartLine[]> {
    const cartLines$ = this.productServ.getCartLines();
    return await lastValueFrom(cartLines$);
  }

  private sendPostOrPutAPI(data: ICartLine[]): Observable<ICartLine> {
    const cartLineIndex = data.findIndex((x) => x.product.id === this.productObj?.id);
    var cartLineObj: ICartLine;

    switch (true) {
      case cartLineIndex != -1:
        const cartLineID = data[cartLineIndex].id;
        cartLineObj = {
          product: this.productObj,
          quantity: (data[cartLineIndex].quantity += 1),
        };

        return this.put(cartLineID, cartLineObj);
      default:
        cartLineObj = {
          product: this.productObj,
          quantity: 1,
        };

        return this.post(cartLineObj);
    }
  }

  private post(cartLineObj: ICartLine): Observable<ICartLine> {
    return this.productServ.post(cartLineObj).pipe(
      untilDestroyed(this),
      tap((obj) => this.updatedData.push(obj)),
      finalize(() => {
        this.recalculate();
      })
    );
  }

  private put(cartLineID: number | undefined, cartLineObj: ICartLine): Observable<ICartLine> {
    return this.productServ.put(cartLineID, cartLineObj).pipe(
      untilDestroyed(this),
      finalize(() => {
        this.recalculate();
      })
    );
  }

  private delete(cartLineID: number | undefined, cartLineIndex: number): Observable<ICartLine> {
    return this.productServ.delete(cartLineID).pipe(
      untilDestroyed(this),
      tap(() => this.updatedData.splice(cartLineIndex, 1)),
      finalize(() => {
        this.recalculate();
      }));
  }

  private isObjectEmpty(obj: IProduct): boolean {
    return Object.keys(obj).length === 0;
  }

  private recalculate(): void {
    this.itemCount = 0;
    this.cartPrice = 0;
    this.updatedData.forEach((line) => {
      this.itemCount += line.quantity;
      this.cartPrice += line.quantity * line.product.price;
    });
  }

  public updateQuantity(product: Product, quantity: number): Subscription {
    const cartLineIndex = this.updatedData.findIndex((x) => x.product.id === product.id);
    const cartLineID = this.updatedData[cartLineIndex]?.id;
    const cartLineObj = {
      product: product,
      quantity: (this.updatedData[cartLineIndex].quantity = Number(quantity)),
    };

    return this.put(cartLineID, cartLineObj).subscribe();
  }

  public removeLine(productId: number): Subscription {
    const cartLineIndex = this.updatedData.findIndex((x) => x.product.id === productId);
    const cartLineID = this.updatedData[cartLineIndex]?.id;

    return this.delete(cartLineID, cartLineIndex).subscribe();
  }

  ngOnDestroy(): void {
    console.log("%c ########### Component Destroy! ", "color: red;");
  }
}
