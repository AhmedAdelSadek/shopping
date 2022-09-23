import { HttpClient, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { ICartLine } from "../models/ICartLine";
import { IProduct } from "../models/iproduct";
import { Product } from "../models/Product";
import { Category } from "../site-framework/category";
// https://github.com/typicode/json-server
// https://www.youtube.com/watch?v=KZTu40cW4M0&list=PLp50dWW_m40WQ9-t0lyamekhE2OiZQrCG&index=3
// https://medium.com/codingthesmartway-com-blog/create-a-rest-api-with-json-server-36da8680136d
@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private readonly _onProductChange = new BehaviorSubject<any>({});

  set onProductChange(product: IProduct) {
    this._onProductChange.next(Object.assign({}, product));
  }
  get onProductChange(): IProduct {
    return this._onProductChange.getValue();
  }

  messages: string[] = [];
  constructor(private httpClient: HttpClient) {}

  // get all products
  getAllProducts(): Observable<IProduct[]> {
    const productUrl = "http://localhost:3000/products";
    return this.httpClient.get<IProduct[]>(productUrl); // return an observable
  }
  // get products by category number
  searchCategoryProducts(categoryId: string): Observable<IProduct[]> {
    const productUrl =
      "http://localhost:3000/products?categoryId=" + categoryId;
    return this.httpClient
      .get<IProduct[]>(productUrl)
      .pipe(
        tap((x) =>
          x.length
            ? this.log(`found Products matching "${categoryId}"`)
            : this.log(`no Products matching "${categoryId}"`)
        )
      );
  }
  // get products with specific Date
  searchDateProducts(date: string): Observable<IProduct> {
    const productUrl = "http://localhost:3000/products/date=" + date;
    return this.httpClient.get<IProduct>(productUrl); // return an observable
  }
  // get product by ID
  viewProduct(id: number): Observable<IProduct> {
    const productUrl = "http://localhost:3000/products/" + id;
    return this.httpClient.get<IProduct>(productUrl); // return an observable
  }

  // add new Object of product
  createProduct(productBody: IProduct): Observable<HttpEvent<IProduct>> {
    const productUrl = "http://localhost:3000/products";
    // post<Product> => this means, what type I am expecting to be returned as product from Post method.
    return this.httpClient.post<IProduct>(productUrl, productBody, {
      reportProgress: true,
      observe: "events",
    });
  }

  // edit exist product
  updateProduct(
    productId: number,
    productBody: IProduct
  ): Observable<IProduct> {
    const productUrl = "http://localhost:3000/products/" + productId;
    return this.httpClient.put<IProduct>(productUrl, productBody); // return an observable
  }
  // delete product
  deleteProduct(productId: number): Observable<IProduct> {
    const productUrl = `http://localhost:3000/products/${productId}`;
    return this.httpClient
      .delete<IProduct>(productUrl)
      .pipe(tap((_) => this.log(`deleted Product id=${productId}`)));
  }

  // get all Categories
  getCategories(): Observable<Category[]> {
    const categoriesUrl = "http://localhost:3000/categories";
    return this.httpClient.get<Category[]>(categoriesUrl);
  }
  /**
   * Logs products service
   * @param message
   */
  private log(message: string) {
    this.add(`ProductService: ${message}`);
  }
  /**
   * Adds products service
   * @param message
   */
  private add(message: string) {
    this.messages.push(message);
  }

  post(cartLineBody: ICartLine): Observable<ICartLine> {
    const productUrl = "http://localhost:3000/cartLine";
    return this.httpClient.post<ICartLine>(productUrl, cartLineBody, {});
  }

  getCartLines(): Observable<ICartLine[]> {
    const productUrl = "http://localhost:3000/cartLine";
    return this.httpClient.get<ICartLine[]>(productUrl);
  }

  put(productId: number | undefined, obj: ICartLine): Observable<ICartLine> {
    const productUrl = "http://localhost:3000/cartLine/" + productId;
    return this.httpClient.put<ICartLine>(productUrl, obj);
  }

  delete(productId: number | undefined): Observable<ICartLine> {
    const productUrl = `http://localhost:3000/cartLine/${productId}`;
    return this.httpClient
      .delete<ICartLine>(productUrl)
      .pipe(tap((_) => this.log(`deleted CartLin id=${productId}`)));
  }
}
