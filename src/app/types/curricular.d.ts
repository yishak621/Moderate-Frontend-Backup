export interface Curricular {
  id: string;
  name: string;
  description?: string;
  teachers?: number;
  posts?: number;
  status: "active" | "inactive";
}
