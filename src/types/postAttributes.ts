export interface PostAttributes {
  id: string | number;
  name_of_post: string;
  posted_by: string;
  uploaded_at: string;
  files: string[];
  post_tags: string[];
  post_status: "draft" | "published" | "archived";
  post_grade_avg: string | number;
}
