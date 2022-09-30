import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { AngularMaterialModule } from "src/material.module";
import { PrimengModule } from "src/primeng.module";
import { AppComponent } from "./app.component";
import { AppMainComponent } from "./AppMain/AppMain.component";
import { AuthenticationModule } from "./authentication/authenticationModule/authentication.module";
import { SiteFrameworkModule } from "./site-framework/site-framework.module";

const routes: Routes = [
  {
    path: "authentication",
    loadChildren: () =>
      import(
        "./authentication/authenticationModule/authentication.module"
      ).then((m) => m.AuthenticationModule),
  },
  {
    path: "",
    component: AppMainComponent,
    children: [
      {
        path: "products",
        loadChildren: () =>
          import("./products/products.module").then((m) => m.ProductsModule),
      },
      {
        path: "file-manager",
        loadChildren: () =>
          import("./file-manager/file-manager.module").then(
            (m) => m.FileManagerModule
          ),
      },
    ],
  },

  // { path: 'frameWork', loadChildren: () => import('./site-framework/site-framework.module').then(m => m.SiteFrameworkModule) },
  // { path: 'login', component: LoginComponent },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent, AppMainComponent],
  imports: [
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    BrowserModule,
    BrowserAnimationsModule,

    AngularMaterialModule,
    FlexLayoutModule,
    PrimengModule,

    AuthenticationModule,
    SiteFrameworkModule,

    RouterModule.forRoot(routes),
  ],
  providers: [
    // HashLocationStrategy => http://localhost:4200/#/
    // we use  HashLocationStrategy, when the web server does not support pathLocationStrategy.
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
// pathlocationstrategy vs hashlocationstrategy
// https://www.tektutorialshub.com/angular/angular-location-strategies/
// For me the main difference is that the PathLocationStrategy requires a configuration on the server side to all the paths configured in @RouteConfig to be redirected to the main HTML page of your Angular2 application. Otherwise you will have some 404 errors when trying to reload your application in the browser or try to access it using a particular URL.
