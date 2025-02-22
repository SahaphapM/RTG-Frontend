import type { Invoice } from "./invoice";

export type JobQuotation = {
  id?: number;
  description: string;
  ourRef: string;
  priceOffered: number;
  invoiceMethod?: string;
  invoiceTerms: string;
  deliveryTime: string;
  deliveryPlace: string;
  vatPercentage: number;
  message: string;
  bestRegards: string;
  invoices?: Invoice[];
  createdAt?: Date;
  updatedAt?: Date;
};
