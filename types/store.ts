export type PartnerStore = {
  id?: number;
  name: string;
  description: string;
  address: string;
  bannerImage: string;
  primaryPhone: string;
  additionalPhone?: string[];
  isPublish?: boolean;
  createdDate?: string;
  updatedDate?: string;
};

export type PartnerStorePayload = {
  name: string;
  description: string;
  address: string;
  bannerImage: string;
  primaryPhone: string;
  additionalPhone: string[];
  isPublish?: boolean;
};
