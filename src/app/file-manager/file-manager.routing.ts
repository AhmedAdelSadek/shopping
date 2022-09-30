import { Route } from "@angular/router";
import { CanDeactivateFileManagerDetails } from "./file-manager.guards";
import { FileManagerListComponent } from "./list/list.component";
import { FileManagerDetailsComponent } from "./details/details.component";
import {
  FileManagerFolderResolver,
  FileManagerItemResolver,
  FileManagerItemsResolver,
} from "./file-manager.resolvers";
import { FileManagerComponent } from "./file-manager.component";

export const fileManagerRoutes: Route[] = [
  {
    path: "",
    component: FileManagerComponent,
    children: [
      {
        path: "",
        component: FileManagerListComponent,
        resolve: { items: FileManagerItemsResolver },
        children: [
          {
            path: "details/:id",
            component: FileManagerDetailsComponent,
            resolve: {
              item: FileManagerItemResolver,
            },
            canDeactivate: [CanDeactivateFileManagerDetails],
          },
        ],
      },
      {
        path: "folders/:folderId",
        component: FileManagerListComponent,
        resolve: { item: FileManagerFolderResolver },
        children: [
          {
            path: "details/:id",
            component: FileManagerDetailsComponent,
            resolve: {
              item: FileManagerItemResolver,
            },
            canDeactivate: [CanDeactivateFileManagerDetails],
          },
        ],
      },
    ],
  },
];
