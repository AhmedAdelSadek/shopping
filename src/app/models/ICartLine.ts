import { IProduct } from "./IProduct";

export interface ICartLine {
  id?: number;
  quantity: number;
  product: IProduct;
}
