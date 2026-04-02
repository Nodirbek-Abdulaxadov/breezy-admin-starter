export type ProductStatus = "Active" | "Limited" | "Out of Stock";

export interface Product {
  sku: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: ProductStatus;
}

export type EmployeeStatus = "Active" | "Inactive" | "On Leave";

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: EmployeeStatus;
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
