// Define proper types
export interface ApiRevenueItem {
  month: string;
  totalRevenue: number;
}

export interface Setting {
  id?: string;
  key: string;
  value: string[];
  category?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  stripePriceId?: string;
  stripeProductId?: string;

  currency: string;
  interval: string;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  savings: string | null;
  sortOrder?: number;
}
