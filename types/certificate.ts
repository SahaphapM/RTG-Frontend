import type { Project } from "./project";
import type { Subcontractor } from "./subcontractor";

export type Certificate = {
  id?: number;
  name: string;
  description: string;
  date: string; // Date of the purchase order (ISO format: "YYYY-MM-DD")
  file: string;
  subcontractor?: Subcontractor;
  project?: Project;
};
