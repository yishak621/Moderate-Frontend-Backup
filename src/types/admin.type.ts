// Define proper types
export interface ApiRevenueItem {
  month: string;
  totalRevenue: number;
}

export type Setting = {
  id: string;
  key: string;
  value: string[]; // array of strings
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
