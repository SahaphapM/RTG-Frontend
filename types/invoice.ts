import type { InvoiceDetail } from "./invoiceDetail";

export type Invoice = {
  id?: number | null;
  date: string;
  ourRef: string;
  // ourTax: string;
  // cusTax: string;
  paidDate: string | null;
  taxInvoice: string;
  invoiceTerms: string;
  invoiceDetails: InvoiceDetail[];
  discount: number;
  total: number;
  bank: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  swift: string;
  receivedBy: string;
  receivedDate: string | null;
};
