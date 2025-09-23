export interface EmailDomains {
  id: string;
  emailDomain: string;
  schoolName: string;
  teachers: number;
  createdDate?: string;
  status: "Active" | "Inactive";
}
