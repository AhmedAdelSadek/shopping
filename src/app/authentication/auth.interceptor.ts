import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpCacheService } from "./HttpCache.service";

// https://karthiktechblog.com/angular/how-to-implement-time-based-caching-in-angular-using-http-interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor (private cacheService: HttpCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    //check if the outgoing calls are GET and MRDH APIs

    if (req.method === "GET" && req.urlWithParams.search('username') > 0) {
      // attempt to retrieve a cached response
      const cachedResponse: HttpResponse<any> | undefined = this.cacheService.get(req.url);

      // return cached response
      if (cachedResponse) {
        console.log(`Returning a cached response: ${cachedResponse.url}`);
        return of(cachedResponse);
      }

      // send request to server and add response to cache
      return next.handle(req).pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            console.log(`Adding item to cache: ${req.url}`);
            this.cacheService.put(req.url, event);
          }
        })
      );
    } else {
      // pass along non-cacheable requests
      return next.handle(req);
    }
  }
}
