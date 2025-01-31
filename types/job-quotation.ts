import type { Payment } from "./payment";

export type JobQuotation = {
  id?: number;
  description: string;
  priceOffered?: number;
  paymentTerms: string;
  deliveryTime: string;
  deliveryPlace: string;
  vatPercentage: number;
  message: string;
  bestRegards: string;
  payments?: Payment[];
  createdAt?: Date;
};
