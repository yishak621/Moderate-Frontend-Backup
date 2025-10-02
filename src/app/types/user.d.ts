export interface UserDomain {
  userId: string;
  domainId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  UserDomains: UserDomain;
}

export interface Upload {
  id: string;
  fileName: string;
  postId: string | null;
  fileUrl: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailDomain?: string;
  role?: string;
  isVerified?: boolean;
  isDisabled?: boolean;
  stripeCustomerId?: string | null;
  freeTrialStartDate?: string | null;
  freeTrialEndDate?: string | null;
  hasUsedFreeTrial?: boolean;
  subscriptionStatus?: "free" | "monthly" | "yearly";
  subscriptionPlan?: string | null;
  subscriptionEndDate?: string | null;
  lastVerificationSent?: string | null;
  lastVerified?: string | null;
  lastSeen?: string | null;
  verificationStatus?: "active" | "suspended" | "inactive";
  resetTokenExpiry?: string | null;
  createdAt: string;
  updatedAt: string;
  domains?: Domain[];
  uploads?: Upload[];
}
