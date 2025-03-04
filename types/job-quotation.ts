import type { Invoice } from "./invoice";

export type JobQuotation = {
  id?: number;
  description: string;
  ourRef: string;
  priceOffered: number;
  invoiceTerms: string;
  deliveryTime: string;
  deliveryPlace: string;
  vatPercentage: number;
  message: string;
  invoices?: Invoice[];
};
