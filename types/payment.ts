import type { PaymentDetail } from "./paymentDetail";

export type Payment = {
  id: number | null;
  date: Date;
  ourRef: string;
  ourTax: string;
  cusTax: string;
  paidDate: Date | null;
  taxInvoice: string;
  paymentTerms: string;
  paymentDetails: PaymentDetail[];
  discount: number;
  total: number;
  bank: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  swift: string;
  receivedBy: string;
  receivedDate: Date | null;
};
