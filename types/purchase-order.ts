import type { Customer } from "./customer";
import type { OrderDetail } from "./orderDetail";
import type { Project } from "./project";
import type { Subcontractor } from "./subcontractor";

export type PurchaseOrder = {
  id?: number | null;
  number: string;
  name: string;
  qtNumber: string;
  ourRef: string;
  // description: string;
  date: string; // Date of the purchase order (ISO format: "YYYY-MM-DD")
  project: Project | null;
  subcontractor: Subcontractor | null;
  customer: Customer | null;
  orderDetails: OrderDetail[];
  total: number;
  discount: number;
  vat: number;
  file: string | null;
  shippedDate: string | null; // ส่งแล้ว กำลังส่ง
  shipPlace: string | null;
  startDate: string | null;
  payment: string | null;
};
