import type { Installment } from "./installment";

export type jobQuotation = {
  id: number;
  date: Date;
  paymentMethod: string | null;
  installments: Installment[];
};
