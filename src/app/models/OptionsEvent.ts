import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface OptionsEvent {
    headers?: | HttpHeaders | { [header: string]: string | string[]; };
    observe: "events";
    context?: HttpContext;
    params?: | HttpParams | { [param: string]: | string | number | boolean | ReadonlyArray<string | number | boolean>; };
    reportProgress?: boolean;
    responseType?: "json";
    withCredentials?: boolean;
}