import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "src/material.module";
import { SiteFrameworkModule } from "../site-framework/site-framework.module";
import { FileManagerDetailsComponent } from "./details/details.component";
import { FileManagerComponent } from "./file-manager.component";
import {
  FileManagerFolderResolver,
  FileManagerItemResolver,
  FileManagerItemsResolver,
} from "./file-manager.resolvers";
import { fileManagerRoutes } from "./file-manager.routing";
import { FileManagerService } from "./file-manager.service";
import { FileManagerListComponent } from "./list/list.component";

@NgModule({
  declarations: [
    FileManagerComponent,
    FileManagerDetailsComponent,
    FileManagerListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SiteFrameworkModule,
    AngularMaterialModule,
    RouterModule.forChild(fileManagerRoutes),
  ],
  providers: [
    FileManagerService,
    FileManagerItemsResolver,
    FileManagerFolderResolver,
    FileManagerItemResolver,
  ],
})
export class FileManagerModule {}
