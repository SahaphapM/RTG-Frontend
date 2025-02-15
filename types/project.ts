import type { Customer } from "./customer";
import type { JobQuotation } from "./job-quotation";
import type { ProjectItem } from "./projectItem";

export type Project = {
  id?: number;
  name: string;
  description: string;
  number: string;
  startDate: string | null;
  endDate: string | null;

  totalProjectPrice: number | null;
  customer?: Customer | null;
  projectItems: ProjectItem[];
  jobQuotations: JobQuotation[];
};
