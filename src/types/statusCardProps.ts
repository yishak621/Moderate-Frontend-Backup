import { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  count: number;
  description?: string;
  colored?: boolean;
  icon?: LucideIcon;
}
