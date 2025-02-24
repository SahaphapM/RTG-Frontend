import type { Customer } from "./customer";
import type { OrderDetail } from "./orderDetail";
import type { Subcontractor } from "./subcontractor";

export type PurchaseOrder = {
  id?: number | null;
  number: string;
  qtNumber: string;
  ourRef: string;
  description: string;
  date: string; // Date of the purchase order (ISO format: "YYYY-MM-DD")
  subcontractor: Subcontractor;
  customer: Customer;
  orderDetails: OrderDetail[];
  total: number;
  discount: number;
  vat: number;
  file: string | null;
};
