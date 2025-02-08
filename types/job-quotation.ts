import type { Payment } from "./payment";

export type JobQuotation = {
  id?: number;
  description: string;
  customerRef: string;
  agentName?: string;
  priceOffered: number;
  paymentMethod?: string;
  paymentTerms: string;
  deliveryTime: string;
  deliveryPlace: string;
  vatPercentage: number;
  message: string;
  bestRegards: string;
  payments?: Payment[];
  createdAt?: Date;
  updatedAt?: Date;
};
