export interface Curricular {
  id: string;
  name: string;
  description: string;
  teachers: number;
  posts: number;
  status: "Active" | "Inactive";
}
