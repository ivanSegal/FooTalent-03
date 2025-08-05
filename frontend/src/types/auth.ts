export type AuthUser = {
  id?: string;
  email: string;
  password?: string;
  name?: string;
  token?: string;
  [key: string]: unknown;
};
