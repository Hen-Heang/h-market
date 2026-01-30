export type PartnerProfile = {
  firstName: string;
  lastName: string;
  gender: string;
  profileImage?: string | null;
  createdDate?: string;
  updatedDate?: string;
};

export type PartnerProfilePayload = {
  firstName: string;
  lastName: string;
  gender: string;
  profileImage?: string | null;
};
