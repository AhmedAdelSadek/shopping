
import { IProduct } from "./iproduct";

export interface ICartLine {
    id?: number,
    quantity: number,
    product: IProduct;
}


// export class CaerLine{
//     id?: number;
//     quantity: number;
//     product: IProduct;

//     constructor(){

//     }
// }