import { IProduct } from "./iproduct";

export class Product implements IProduct {
    id: number;
    code?: string;
    categoryId: number;
    productName: string;
    description: string;
    productImg: string;
    price: number;
    isAvailable: boolean;
    category?: string;
    quantity: number;
    inventoryStatus?: string;
    rating: number;
    static counter = 0;

    constructor (object: IProduct) {
        let color = 'red';
        Product.counter++;
        console.log(`%c${Product.countObjects()}`, `color: ${color}`);

        this.id = object.id;
        this.code = object.code;
        this.categoryId = +object.categoryId;
        this.productName = object.productName;
        this.description = object.description;
        this.productImg = object.productImg;
        this.price = +object.price;
        this.isAvailable = object.isAvailable;
        this.category = object.category;
        this.quantity = +object.quantity;
        this.inventoryStatus = object.inventoryStatus;
        this.rating = +object.rating;
    }

    static countObjects() {
        return `${Product.counter} Object Created from Product.`;
    };

}