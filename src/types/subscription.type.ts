export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  plan: "monthly" | "yearly";
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionDetailsProps {
  user: {
    subscriptionStatus?: string;
    subscriptionPlan?: string;
    subscriptionEndDate?: string;
    hasUsedFreeTrial?: boolean;
    freeTrialStartDate?: string | null;
    freeTrialEndDate?: string | null;
    subscriptions?: Subscription[];
  };
}
