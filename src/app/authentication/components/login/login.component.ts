import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { ProgressSpinnerMode } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  throwError,
  concatMap,
  distinct,
} from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  finalize,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import { IAuthorizedUser } from "src/app/models/IAuthorizedUser";
import { SiteFrameworkService } from "src/app/site-framework/site-framework.service";
import { AccountService } from "../../account.service";

// https://rxjs.dev/api/index/function/concatMap
// https://rxjs.dev/api/operators/distinctUntilKeyChanged
// https://rxjs.dev/api/operators/distinctUntilChanged
@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  errorMessage!: string;
  loggingIn: boolean = false;
  readonly cancellationToken: Subject<any> = new Subject();
  // spinner
  color: ThemePalette = "primary";
  mode: ProgressSpinnerMode = "determinate";
  value = 100;
  // search users
  private users$!: Observable<IAuthorizedUser[]>;
  private onLoginUserChanged = new BehaviorSubject<IAuthorizedUser>({
    username: "",
    password: "",
  });
  subscription!: Subscription;

  /**
   * Creates an instance of login component.
   * @param formBuilder
   * @param accountService
   * @param siteFrameworkService
   * @param _router
   */
  constructor(
    protected formBuilder: FormBuilder,
    private accountService: AccountService,
    private siteFrameworkService: SiteFrameworkService,
    private _router: Router
  ) {
    // setting framework configuration
    this.siteFrameworkService.config = {
      layout: {
        navbar: { hidden: true },
        toolbar: { hidden: true },
        footer: { hidden: true },
        sidebar: { hidden: true },
      },
    };
    // Create the form
    this.loginForm = this.formBuilder.group({
      login: ["", [Validators.required]],
      password: ["", Validators.required],
      remember: [false],
    });
  }
  /**
   * on init
   */
  ngOnInit(): void {}
  /**
   * Login without using BehaviorSubject
   * @returns
   */
  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loggingIn = true;

    this.loginForm.disable();
    // create updated Object
    const user: any = {
      username: this.loginForm?.get("login")?.value,
      password: this.loginForm?.get("password")?.value,
    };

    this.accountService
      .searchUserByUsernameAndPassword(user)
      .pipe(
        takeUntil(this.cancellationToken),
        finalize(() => {
          setTimeout(() => {
            this.loggingIn = false;
          }, 2000);
        }),
        concatMap((ms) => {
          if (!ms.length) {
            this.loginForm.enable();
            let response = new HttpErrorResponse({
              error: "401 Unauthorized",
              status: 401,
              statusText: "NOT FOUND",
            });
            return throwError(() => response);
          } else {
            return ms;
          }
        }),
        //distinctUntilKeyChanged('password'),
        distinctUntilChanged((prev: IAuthorizedUser, curr: IAuthorizedUser) => {
          return (
            prev.username === curr.username && prev.password === curr.password
          );
        })
      )
      .subscribe({
        next: (data) => {
          console.log(data)
          setTimeout(() => {
            this.siteFrameworkService.config = {
              layout: {
                navbar: { hidden: true },
                toolbar: { hidden: true },
                footer: { hidden: false },
                sidebar: { hidden: false },
              },
            };
            this._router.navigateByUrl(`products`);
          }, 2000);
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
            console.log(
              "%c ########### completed! ",
              "background: green; color: white"
            );
          }, 0);
        },
      });
  }

  /**
   * on destroy
   */
  ngOnDestroy(): void {
    this.cancellationToken.next(null);
    this.cancellationToken.complete();
    // this.subscription.unsubscribe();
  }

































































  
  /**
   * This function is using BehaviorSubject(onLoginUserChanged)
   */
  login2(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loggingIn = true;

    // Disable the form
    this.loginForm.disable();

    const user: IAuthorizedUser = {
      username: this.loginForm?.get("login")?.value,
      password: this.loginForm?.get("password")?.value,
    };

    // this.onLoginUserChanged.next(user);
    this.onLoginUserChanged.next(user);

    this.users$ = this.onLoginUserChanged.pipe(
      // wait 2000ms after each keystroke before considering the term
      debounceTime(2000),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // Only emit when the specified key value has changed
      distinctUntilKeyChanged("password"),
      // switch to new search observable each time the term changes
      switchMap((user: IAuthorizedUser) => {
        return this.accountService.searchUserByUsernameAndPassword(user).pipe(
          takeUntil(this.cancellationToken),
          finalize(() => {
            setTimeout(() => {
              this.loggingIn = false;
            }, 2000);
          })
        );
      })
    );

    this.subscription = this.users$.subscribe({
      next: (data: IAuthorizedUser[]) => {
        if (!data.length) {
          this.loginForm.enable();
          return;
        }

        setTimeout(() => {
          this.siteFrameworkService.config = {
            layout: {
              navbar: { hidden: true },
              toolbar: { hidden: true },
              footer: { hidden: false },
              sidebar: { hidden: false },
            },
          };
          this._router.navigateByUrl(`products`);
        }, 2000);
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
          console.log(
            "%c ########### completed! ",
            "background: green; color: white"
          );
        }, 0);
      },
    });
  }
}
