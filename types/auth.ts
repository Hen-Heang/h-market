export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  token?: string;
  userId?: number;
  roleId?: number;
};

export type RegisterPayload = {
  email: string;
  password: string;
  roleId: number;
};

export type RegisterResult = {
  email: string;
};

export type GenerateCodePayload = {
  email: string;
};

export type VerifyEmailPayload = {
  email: string;
  code: string;
};

export type ResetPasswordPayload = {
  email: string;
  code: string;
  newPassword: string;
};

export type BasicResult = {
  message?: string;
  data?: unknown;
};
