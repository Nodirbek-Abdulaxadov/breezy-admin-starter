import type { Order, Product } from "@/types/data";

const products: Product[] = [
  { sku: "PRD-1001", name: "Starter License", category: "Software", price: "$29", stock: 124, status: "Active" },
  { sku: "PRD-1002", name: "Pro License", category: "Software", price: "$79", stock: 82, status: "Active" },
  { sku: "PRD-2001", name: "Consulting Hours", category: "Service", price: "$120", stock: 36, status: "Limited" },
  { sku: "PRD-3001", name: "Team Enablement Pack", category: "Bundle", price: "$299", stock: 0, status: "Out of Stock" },
];

const orders: Order[] = [
  { id: "#ORD-9021", customer: "Acme Corp", total: "$1,280", payment: "Paid", fulfillment: "Shipped", date: "2026-04-01" },
  { id: "#ORD-9018", customer: "Globex Ltd", total: "$320", payment: "Pending", fulfillment: "Processing", date: "2026-04-01" },
  { id: "#ORD-9012", customer: "Initech", total: "$2,140", payment: "Paid", fulfillment: "Delivered", date: "2026-03-31" },
  { id: "#ORD-9004", customer: "Umbrella Inc", total: "$780", payment: "Refunded", fulfillment: "Cancelled", date: "2026-03-30" },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dataService = {
  async getProducts(): Promise<Product[]> {
    await delay(300);
    return products;
  },
  async getOrders(): Promise<Order[]> {
    await delay(300);
    return orders;
  },
};
