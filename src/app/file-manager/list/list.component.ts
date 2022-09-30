import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDrawer } from "@angular/material/sidenav";
import { Observable, Subject, takeUntil } from "rxjs";
import { FileManagerService } from "../file-manager.service";
import { Item, Items } from "../file-manager.types";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: "file-manager-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerListComponent implements OnInit, OnDestroy {
  @ViewChild("matDrawer", { static: true }) matDrawer!: MatDrawer;
  drawerMode!: "side" | "over";
  selectedItem!: Item;
  items!: Items;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  _items: any;

  mobileQuery!: MediaQueryList;

  /**
   * ! this is constructor
   * ? working when the component initialize
   * Creates an instance of file-manager-list component.
   * @param _activatedRoute
   * @param _changeDetectorRef
   * @param _router
   * @param _fileManagerService
   * @param _breakpointObserver
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _fileManagerService: FileManagerService,
    private _breakpointObserver: BreakpointObserver
  ) {
    this._items = this._activatedRoute.snapshot.data["items"];
  }

  ngOnInit(): void {
    // Get the items
    this._fileManagerService.items$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((items: Items) => {
        this.items = items;
        console.log(this.items);

        this._changeDetectorRef.markForCheck();
      });

    // Get the item
    this._fileManagerService.item$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((item: Item) => {
        this.selectedItem = item;

        this._changeDetectorRef.markForCheck();
      });

    // Subscribe to media query change
    this.onMediaQueryChange$("(min-width: 1120px)")
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((state) => {
        console.log(state);
        // Calculate the drawer mode
        this.drawerMode = state.matches ? "side" : "over";

        this._changeDetectorRef.markForCheck();
      });
  }

  onMediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
    return this._breakpointObserver.observe(query);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(["./"], { relativeTo: this._activatedRoute });

    this._changeDetectorRef.markForCheck();
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
