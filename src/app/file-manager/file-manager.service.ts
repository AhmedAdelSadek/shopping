import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
    BehaviorSubject,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from "rxjs";
import { Item, Items } from "./file-manager.types";
import { cloneDeep } from "lodash-es";

@Injectable({
    providedIn: "root",
})
export class FileManagerService {
    // Private
    private _item: BehaviorSubject<any> = new BehaviorSubject(null);
    private _items: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor (private _httpClient: HttpClient) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for items
     */
    get items$(): Observable<Items> {
        return this._items.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    /**
     * Get items
     */

    registerHandlers(itemList: Item[], folderISerialID: string): Items {
        let items = cloneDeep(itemList);
        const folderId = folderISerialID ?? null;
        items = items.filter((item: Item) => item.folderId === folderId);

        const folders: Item[] = items.filter(
            (item: Item) => item.type === "folder"
        );
        const files = items.filter((item: Item) => item.type !== "folder");
        folders.sort((a: Item, b: Item) => a.name.localeCompare(b.name));
        files.sort((a: Item, b: Item) => a.name.localeCompare(b.name));

        const pathItems = cloneDeep(itemList);
        const path = [];

        let currentFolder: Item | undefined = undefined;

        if (folderId) {
            currentFolder = pathItems.find((item: Item) => item.id === folderId);
            path.push(currentFolder);
        }

        while (currentFolder?.folderId) {
            currentFolder = pathItems.find(
                (item: Item) => item.id === currentFolder?.folderId
            );
            if (currentFolder) {
                path.unshift(currentFolder);
            }
        }

        return {
            folders,
            files,
            path,
        };
    }

    getItems(folderId: any = null): Observable<Item[]> {
        console.log(folderId);
        const productUrl = "http://localhost:3000/items";
        return this._httpClient.get<Item[]>(productUrl).pipe(
            tap((response) => {
                console.log(response);
                let res = this.registerHandlers(response, folderId);
                console.log(res);
                this._items.next(res);
            })
        );
    }

    /**
     * Get item by id
     */
    getItemById(id: string): Observable<Item> {
        // const productUrl = "http://localhost:3000/items/" + id;
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find within the folders and files
                const item =
                    [...items?.folders, ...items?.files].find(
                        (value) => value.id === id
                    ) || null;

                // Update the item
                this._item.next(item);

                // Return the item
                return item;
            }),
            switchMap((item) => {
                if (!item) {
                    return throwError(
                        () => "Could not found the item with id of " + id + "!"
                    );
                }

                return of(item);
            })
        );
    }
}
