// Define proper types
export interface ApiRevenueItem {
  month: string;
  totalRevenue: number;
}

export interface Setting  {
  id?: string;
  key: string;
  value: string[]; 
  category?: string; 
  description?: string; 
  createdAt?: string; 
  updatedAt?: string; 
};
