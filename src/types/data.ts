export type ProductStatus = "Active" | "Limited" | "Out of Stock";

export interface Product {
  sku: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: ProductStatus;
}

export type PaymentStatus = "Paid" | "Pending" | "Refunded";

export interface Order {
  id: string;
  customer: string;
  total: string;
  payment: PaymentStatus;
  fulfillment: string;
  date: string;
}
