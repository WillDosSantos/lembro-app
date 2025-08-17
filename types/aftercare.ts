// types/aftercare.ts
export type ServiceCategory =
  | "mortuary"
  | "floral"
  | "celebration_design"
  | "venue"
  | "printing"
  | "officiant"
  | "obituary_help"
  | "grief_support"
  | "fundraising";

export type ProviderTier = "free" | "featured" | "premium";

export interface Provider {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  phone?: string;
  email?: string;
  categories: ServiceCategory[];
  serviceAreas: string[]; // ZIPs, cities, or "state:ID"
  tier: ProviderTier;     // controls placement/badge
  isActive: boolean;
  blurb?: string;
}

export interface AftercarePlan {
  goFundMeUrl?: string;
  notes?: string;
  checklist: {
    key: string;
    label: string;
    done: boolean;
  }[];
}

export interface Lead {
  id: string;
  profileId: string;
  providerId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
}
