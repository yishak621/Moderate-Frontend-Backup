import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface StatsCardProps {
  title: string;
  count: number;
  description?: string;
  colored?: boolean;
  icon?: LucideIcon;
  children?: ReactNode;
}
