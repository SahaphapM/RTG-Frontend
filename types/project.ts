import type { Customer } from "./customer";
import type { jobQuotation } from "./job-quotation";
import type { ProjectItem } from "./projectItem";

export type Project = {
  id: number;
  name: string;
  description: string;
  number: string;
  startDate: Date | null;
  endDate: Date | null;
  discount: number | null;
  totalProjectPrice: number | null;
  customer?: Customer | null;
  projectItems?: ProjectItem[];
  jobQuotations?: jobQuotation[];
};
