import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cloneDeep } from "lodash-es";
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from "rxjs";
import { BaseService } from "../shared/baseService.service";
import { Item, Items } from "./file-manager.types";

@Injectable({ providedIn: "root" })
export class FileManagerService extends BaseService {
    private _item: BehaviorSubject<any> = new BehaviorSubject(null);
    private _items: BehaviorSubject<any> = new BehaviorSubject(null);

    get items$(): Observable<Items> {
        return this._items.asObservable();
    }

    get item$(): Observable<Item> {
        return this._item.asObservable();
    }


    /**
     * Creates an instance of file manager service.
     * @param http 
     */
    constructor (http: HttpClient) {
        super(http);
        this.get("http://localhost:3000/items").subscribe(console.log);
    }

    /**
     * Registers handlers
     * @param itemList 
     * @param folderISerialID 
     * @returns handlers 
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
            currentFolder = pathItems.find((item: Item) => item.id === currentFolder?.folderId);
            if (currentFolder) {
                path.unshift(currentFolder);
            }
        }

        return {
            folders, files, path,
        };
    }

    /**
     * Gets items
     * @param [folderId] 
     * @returns items 
     */
    getItems(folderId: any = null): Observable<Item[]> {
        const itemsUrl = "http://localhost:3000/items";
        return this.get<Item[]>(itemsUrl).pipe(
            tap((response) => {
                console.log(response);
                let res = this.registerHandlers(response, folderId);
                console.log(res);
                this._items.next(res);
            })
        );
    }

    /**
     * Gets item by id
     * @param id 
     * @returns item by id 
     */
    getItemById(id: string): Observable<Item> {
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find within the folders and files
                const item = [...items?.folders, ...items?.files].find((value) => value.id === id) || null;

                // Update the item
                this._item.next(item);

                // Return the item
                return item;
            }),
            switchMap((item) => {
                if (!item) {
                    const message: string = "Could not found the item with id of " + id + "!";
                    return throwError(
                        () => message
                    );
                }

                return of(item);
            })
        );
    }
}
