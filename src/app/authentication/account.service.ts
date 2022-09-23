import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { IAuthorizedUser } from "../models/IAuthorizedUser";

@Injectable()
export class AccountService {
  private url: string = "http://localhost:3000/accounts";
  /**
   * Creates an instance of account service.
   * @param httpClient
   */
  constructor(private httpClient: HttpClient) {}
  /**
   * Gets all accounts
   * @returns all accounts
   */
  public getAllAccounts(): Observable<IAuthorizedUser[]> {
    return this.httpClient.get<IAuthorizedUser[]>(this.url);
  }
  /**
   * Logins account service
   * @param productBody
   * @returns login
   */
  public login(productBody: IAuthorizedUser): Observable<IAuthorizedUser> {
    return this.httpClient.post<IAuthorizedUser>(this.url, productBody);
  }
  /**
   * Searchs user by username and password
   * @param user
   * @returns user by username and password
   */
  searchUserByUsernameAndPassword(
    user: IAuthorizedUser
  ): Observable<IAuthorizedUser[]> {
    if (!user.username.trim()) {
      return of([]);
    }
    return this.httpClient
      .get<IAuthorizedUser[]>(
        `${this.url}/?username=${user.username}&password=${user.password}`
      )
      .pipe(
        tap((x) =>
          x.length
            ? console.log(
                `%c ########### found Accounts matching! `,
                `background: blue; color: white`,
                `${user.username}`
              )
            : console.log(
                "%c ########### no Accounts matching! ",
                "background: red; color: white",
                user.username
              )
        ),
        catchError(this.handleError<IAuthorizedUser[]>("search Accounts", []))
      );
  }
  /**
   * Searchs users
   * @param term
   * @returns users
   */
  searchUsersByUsername(term: string): Observable<IAuthorizedUser[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.httpClient
      .get<IAuthorizedUser[]>(`${this.url}/?username=${term}`)
      .pipe(
        tap((x) =>
          x.length
            ? console.log(`found Accounts matching "${term}"`)
            : console.log(`no Accounts matching "${term}"`)
        ),
        catchError(this.handleError<IAuthorizedUser[]>("search Accounts", []))
      );
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    // generic type = common type
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
