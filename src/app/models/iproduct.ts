export interface IProduct {
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
  inventoryStatus?: string
  rating: number;
  lineTotal?: number
}
