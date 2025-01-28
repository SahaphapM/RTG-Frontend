import type { Item } from "./item";

export type ProjectItem = {
  id?: number;
  quantity: number;
  price: number | null;
  totalPrice: number | null;
  item: Item;
};
