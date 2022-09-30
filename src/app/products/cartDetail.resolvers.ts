import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { ICartLine } from "../models/ICartLine";
import { ProductsService } from "./products.service";

@Injectable({
  providedIn: "root",
})
export class CartDetailResolver implements Resolve<any> {
  constructor (
    private _router: Router,
    private _productsService: ProductsService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICartLine[]> {
    return this._productsService.getCartLines().pipe(
      // Error here means the requested task is not available
      catchError((error) => {
        // Log the error
        console.error(error);

        // Get the parent url
        const parentUrl = state.url.split("/").slice(0, -1).join("/");

        // Navigate to there
        this._router.navigateByUrl(parentUrl);

        // Throw an error
        return throwError(() => error);
      })
    );
  }
}
