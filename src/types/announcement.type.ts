export interface Announcement {
  id: number;
  circleColor?: string;
  title: string;
  content: string;
  createdAt: string;
  priority: string;
}

export interface AnnouncementBoxProps {
  announcement: Announcement;
}
