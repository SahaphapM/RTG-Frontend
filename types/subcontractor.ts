export type Subcontractor = {
  id?: number; // Primary Key: Auto-incremented ID
  name: string; // Name of the subcontractor
  description: string; // Description of the subcontractor
  // type?: string | null; // Type of the subcontractor (e.g., "Contractor")
  address: string; // Address of the subcontractor
  email: string; // Email of the subcontractor
  contact: string; // Contact number of the subcontractor
  taxId: string;
};
