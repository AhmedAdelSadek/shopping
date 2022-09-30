import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { Subject, takeUntil } from "rxjs";
import { FileManagerListComponent } from "../list/list.component";
import { FileManagerService } from "../file-manager.service";
import { Item } from "../file-manager.types";

@Component({
  selector: "file-manager-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy {
  item!: Item;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Creates an instance of file manager details component.
   * @param _changeDetectorRef
   * @param _fileManagerListComponent
   * @param _fileManagerService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fileManagerListComponent: FileManagerListComponent,
    private _fileManagerService: FileManagerService
  ) {}

  ngOnInit(): void {
    // Open the drawer
    this._fileManagerListComponent.matDrawer.open();

    // Get the item
    this._fileManagerService.item$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((item: Item) => {
        // Open the drawer in case it is closed
        this._fileManagerListComponent.matDrawer.open();

        // Get the item
        this.item = item;

        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   * Close the drawer
   */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._fileManagerListComponent.matDrawer.close();
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
