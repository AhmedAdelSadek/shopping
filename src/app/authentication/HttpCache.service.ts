import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
// https://karthiktechblog.com/angular/how-to-implement-time-based-caching-in-angular-using-http-interceptor
@Injectable({
  providedIn: "root",
})


export class HttpCacheService {
  // What does index signature => {[key: string]: string} mean in TypeScript?
  // https://bobbyhadz.com/blog/typescript-key-string-string
  // private requests: { [key: string]: Response } = {};
  // or
  // What does Utility Types => Record Type mean in TypeScript?
  // https://fjolt.com/article/typescript-record-type
  private requests: Record<string, Response> = {};

  constructor () { }

  get(url: string): Response {
    return this.requests[url];
  }

  put(url: string, response: HttpResponse<any>): void {
    this.requests[url] = response;
  }

  invalidateUrl(url: string): void {
    this.requests[url] = undefined;
  }

  invalidateCache(): void {
    this.requests = {};
  }
}

type Response = HttpResponse<any> | undefined;