import {
    HttpClient, HttpEvent,
    HttpHeaders
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OptionBlob } from "../models/OptionBlob";
import { OptionsEvent } from "../models/OptionsEvent";

@Injectable()
export abstract class BaseService {

    /**
     * Creates an instance of base service.
     * @param httpClient 
     */
    constructor (@Inject(HttpClient) private httpClient: HttpClient) { }

    /**
     * Gets base service
     * @template T 
     * @param url 
     * @param [header] 
     * @param [params] 
     * @returns get 
     */
    get<T>(url: string, header?: HttpHeaders, params?: any): Observable<T> {
        if (!header) {
            header = new HttpHeaders().set("Content-Type", "application/json");
        }
        return this.httpClient.get<T>(url, { headers: header, params: params });
    }

    /**
     * Posts with progress
     * @template T 
     * @param url 
     * @param body 
     * @param options 
     * @returns with progress 
     */
    postWithProgress<T>(url: string, body: any, options: OptionsEvent): Observable<HttpEvent<T>> {
        return this.httpClient.post<T>(url, body, options);
    }

    /**
     * Puts base service
     * @param url 
     * @param body 
     * @param [options] 
     * @returns  
     */
    put(url: string, body: any, options?: any) {
        return this.httpClient.put(url, body, options);
    }

    /**
     * Puts blob
     * @param url 
     * @param body 
     * @param options 
     * @returns blob 
     */
    putBlob(url: string, body: any, options: OptionBlob): Observable<Blob> {
        return this.httpClient.put(url, body, {
            ...options,
            responseType: "blob",
        });
    }

    /**
     * Deletes base service
     * @template T 
     * @param url 
     * @returns delete 
     */
    delete<T>(url: string): Observable<T> {
        return this.httpClient.delete<T>(url);
    }
}




